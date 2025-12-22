import {
  type EvaluationContext,
  evaluateFlag,
  type FlagConfig,
  type FlagVariation,
  type VariationValue,
} from "@flagix/evaluation-core";
import {
  EVENT_TO_LISTEN,
  type FlagUpdateType,
  REMOVE_TRAILING_SLASH,
} from "@/lib/constants";
import { FLAG_UPDATE_EVENT, FlagixEventEmitter } from "@/lib/emitter";
import { log, setLogLevel } from "@/lib/logger";
import {
  createEventSource,
  type FlagStreamConnection,
} from "@/sse/create-event-source";
import type { FlagixClientOptions } from "@/types";

/**
 * The primary class for the Flagix SDK. Manages configuration state,
 * local caching, and evaluation.
 */
export class FlagixClient {
  private readonly apiKey: string;
  private readonly apiBaseUrl: string;
  private readonly localCache = new Map<string, FlagConfig>();
  private context: EvaluationContext;
  private isInitialized = false;
  private sseConnection: FlagStreamConnection | null = null;
  private readonly emitter: FlagixEventEmitter;

  constructor(options: FlagixClientOptions) {
    this.apiKey = options.apiKey;
    this.apiBaseUrl = options.apiBaseUrl.replace(REMOVE_TRAILING_SLASH, "");
    this.context = options.initialContext || {};
    this.emitter = new FlagixEventEmitter();
    setLogLevel(options.logs?.level ?? "none");
  }

  /**
   * Subscribes a listener to a flag update event.
   */
  on(
    event: typeof FLAG_UPDATE_EVENT,
    listener: (flagKey: string) => void
  ): void {
    this.emitter.on(event, listener);
  }

  /**
   * Unsubscribes a listener from a flag update event.
   */
  off(
    event: typeof FLAG_UPDATE_EVENT,
    listener: (flagKey: string) => void
  ): void {
    this.emitter.off(event, listener);
  }

  /**
   * Fetches all flag configurations from the API, populates the local cache,
   * and sets up the SSE connection for real-time updates.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    log("info", "[Flagix SDK] Starting initialization...");

    await this.fetchInitialConfig();
    this.setupSSEListener();

    this.isInitialized = true;
    log("info", "[Flagix SDK] Initialization complete.");
  }

  /**
   * Returns true if the client has completed initialization
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Evaluates a flag locally using the cached configuration and current context.
   * @param flagKey The key of the flag to evaluate.
   * @param context Optional, temporary context overrides for this specific evaluation.
   */
  evaluate<T extends VariationValue>(
    flagKey: string,
    contextOverrides?: EvaluationContext
  ): T | null {
    if (!this.isInitialized) {
      log(
        "warn",
        `[Flagix SDK] Not initialized. Cannot evaluate flag: ${flagKey}`
      );
      return null;
    }

    const config = this.localCache.get(flagKey);

    if (!config) {
      return null;
    }

    const finalContext = { ...this.context, ...contextOverrides };

    const result = evaluateFlag(config, finalContext);

    if (result) {
      this.trackEvaluation(flagKey, result, finalContext);
    }

    return (result?.value as T) ?? null;
  }

  /**
   * Sets or updates the global evaluation context.
   * @param newContext New context attributes to merge or replace.
   */
  setContext(newContext: EvaluationContext): void {
    this.context = { ...this.context, ...newContext };
    log(
      "info",
      "[Flagix SDK] Context updated. Evaluations will use the new context."
    );
  }

  private async fetchInitialConfig(): Promise<void> {
    const url = `${this.apiBaseUrl}/api/flag-config/all`;

    try {
      const response = await fetch(url, {
        headers: { "X-Api-Key": this.apiKey },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load initial config: ${response.statusText}`
        );
      }

      const allFlags = (await response.json()) as Record<string, FlagConfig>;

      this.localCache.clear();
      for (const [key, config] of Object.entries(allFlags)) {
        this.localCache.set(key, config);
      }
      log("info", `[Flagix SDK] Loaded ${this.localCache.size} flag configs.`);
    } catch (error) {
      log(
        "error",
        "[Flagix SDK] CRITICAL: Initial configuration fetch failed.",
        error
      );
    }
  }

  private async setupSSEListener(): Promise<void> {
    const url = `${this.apiBaseUrl}/api/sse/stream`;

    const source = await createEventSource(url, this.apiKey);
    if (!source) {
      return;
    }

    this.sseConnection = source;

    source.onopen = () => {
      log("info", "[Flagix SDK] SSE connection established.");
    };

    source.onerror = (error) => {
      log("error", "[Flagix SDK] SSE error", error);
    };

    source.addEventListener(EVENT_TO_LISTEN, (event) => {
      try {
        const data = JSON.parse(event.data);
        const { flagKey, type } = data as {
          flagKey: string;
          type: FlagUpdateType;
        };

        log("info", `[Flagix SDK] Received update for ${flagKey} (${type}).`);

        this.fetchSingleFlagConfig(flagKey, type);
      } catch (error) {
        log("error", "[Flagix SDK] Failed to parse SSE event data.", error);
      }
    });
  }

  private async fetchSingleFlagConfig(
    flagKey: string,
    type: FlagUpdateType
  ): Promise<void> {
    const url = `${this.apiBaseUrl}/api/flag-config/${flagKey}`;

    if (type === "FLAG_DELETED" || type === "RULE_DELETED") {
      this.localCache.delete(flagKey);
      log("info", `[Flagix SDK] Flag ${flagKey} deleted from cache.`);
      this.emitter.emit(FLAG_UPDATE_EVENT, flagKey);
      return;
    }

    try {
      const response = await fetch(url, {
        headers: { "X-Api-Key": this.apiKey },
      });

      if (response.status === 404) {
        this.localCache.delete(flagKey);

        log(
          "warn",
          `[Flagix SDK] Flag ${flagKey} not found on API, deleted from cache.`
        );
        this.emitter.emit(FLAG_UPDATE_EVENT, flagKey);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch update for ${flagKey}: ${response.statusText}`
        );
      }

      const config = (await response.json()) as FlagConfig;

      this.localCache.set(flagKey, config);
      log("info", `[Flagix SDK] Flag ${flagKey} updated/synced.`);
      this.emitter.emit(FLAG_UPDATE_EVENT, flagKey);
    } catch (error) {
      log(
        "error",
        `[Flagix SDK] Failed to fetch update for ${flagKey}.`,
        error
      );
    }
  }

  /**
   * Records a custom event (conversion) for analytics and A/B testing.
   */
  track(
    eventName: string,
    properties?: Record<string, unknown>,
    contextOverrides?: EvaluationContext
  ): void {
    const url = `${this.apiBaseUrl}/api/track/event`;

    const finalContext = { ...this.context, ...contextOverrides };
    const distinctId =
      finalContext.userId ?? finalContext.distinctId ?? "anonymous";

    const payload = {
      apiKey: this.apiKey,
      event_name: eventName,
      distinctId,
      properties: properties || {},
      timestamp: new Date().toISOString(),
    };

    const payloadJson = JSON.stringify(payload);

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payloadJson], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) {
        return;
      }
    }

    this.fireAndForgetFetch(url, payloadJson);
  }

  /**
   * Closes the Server-Sent Events (SSE) connection and cleans up resources.
   */
  close(): void {
    if (this.sseConnection) {
      this.sseConnection.close();
      this.sseConnection = null;
      log("info", "[Flagix SDK] SSE connection closed.");
    }

    this.localCache.clear();
    this.isInitialized = false;
    this.emitter.removeAllListeners();
  }

  /**
   * Asynchronously sends an evaluation event to the backend tracking service.
   */
  private trackEvaluation(
    flagKey: string,
    result: FlagVariation,
    context: EvaluationContext
  ): void {
    const url = `${this.apiBaseUrl}/api/track/evaluation`;

    const payload = {
      apiKey: this.apiKey,
      flagKey,
      variationName: result.name,
      variationValue: result.value,
      variationType: result.type,
      distinctId: context.userId ?? context.distinctId ?? "anonymous",
      evaluationContext: context,
      evaluatedAt: new Date().toISOString(),
    };

    const payloadJson = JSON.stringify(payload);

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payloadJson], { type: "application/json" });

      const success = navigator.sendBeacon(url, blob);

      if (success) {
        log("info", `Successfully queued beacon for ${flagKey}.`);
        return;
      }

      log("warn", `Beacon queue full for ${flagKey}. Falling back to fetch.`);
      this.fireAndForgetFetch(url, payloadJson);
    } else {
      this.fireAndForgetFetch(url, payloadJson);
    }
  }

  private fireAndForgetFetch(url: string, payloadJson: string): void {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payloadJson,
      keepalive: true,
    }).catch((error) => {
      log(
        "error",
        `Critical failure sending impression event via fetch: ${error.message}`
      );
    });
  }
}
