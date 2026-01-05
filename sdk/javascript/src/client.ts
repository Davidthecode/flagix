import { evaluateFlag, resolveIdentifier } from "@flagix/evaluation-core";
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
import type {
  EvaluationContext,
  FlagConfig,
  FlagixClientOptions,
  FlagVariation,
  VariationValue,
} from "@/types";

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
  private reconnectAttempts = 0;
  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isReconnecting = false;
  private hasEstablishedConnection = false;
  private readonly maxReconnectAttempts = Number.POSITIVE_INFINITY;
  private readonly baseReconnectDelay = 1000;
  private readonly maxReconnectDelay = 30_000;
  private isConnectingSSE = false;

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
  on = (
    event: typeof FLAG_UPDATE_EVENT,
    listener: (flagKey: string) => void
  ) => {
    this.emitter.on(event, listener);
  };

  /**
   * Unsubscribes a listener from a flag update event.
   */
  off = (
    event: typeof FLAG_UPDATE_EVENT,
    listener: (flagKey: string) => void
  ) => {
    this.emitter.off(event, listener);
  };

  getApiKey(): string {
    return this.apiKey;
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
   * Replaces the global evaluation context.
   */
  identify(newContext: EvaluationContext): void {
    this.context = newContext;
    log("info", "[Flagix SDK] Context replaced");
    this.refreshAllFlags();
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
    this.refreshAllFlags();
  }

  /**
   * Helper to refresh all flags by emitting update events for each cached flag.
   */
  private refreshAllFlags(): void {
    for (const flagKey of this.localCache.keys()) {
      this.emitter.emit(FLAG_UPDATE_EVENT, flagKey);
    }
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
    if (this.isConnectingSSE) {
      return;
    }

    if (this.sseConnection) {
      try {
        this.sseConnection.close();
      } catch (error) {
        log(
          "warn",
          "[Flagix SDK] Error closing existing SSE connection",
          error
        );
      }
      this.sseConnection = null;
    }

    this.isConnectingSSE = true;
    const url = `${this.apiBaseUrl}/api/sse/stream`;

    try {
      const source = await createEventSource(url, this.apiKey);
      if (!source) {
        log("warn", "[Flagix SDK] Failed to create EventSource. Retrying...");
        this.scheduleReconnect();
        return;
      }

      if (!this.isInitialized && !this.isReconnecting) {
        source.close();
        return;
      }

      this.sseConnection = source;

      source.onopen = () => {
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        if (this.reconnectTimeoutId) {
          clearTimeout(this.reconnectTimeoutId);
          this.reconnectTimeoutId = null;
        }

        // If this is a reconnection and not the first connection, refresh the cache
        // this ensures we have the latest flag values that may have changed while disconnected
        if (this.hasEstablishedConnection && this.isInitialized) {
          log(
            "info",
            "[Flagix SDK] SSE reconnected. Refreshing cache to sync with server..."
          );
          this.fetchInitialConfig().catch((error) => {
            log(
              "error",
              "[Flagix SDK] Failed to refresh cache after reconnection",
              error
            );
          });
        } else {
          this.hasEstablishedConnection = true;
        }

        log("info", "[Flagix SDK] SSE connection established.");
      };

      source.onerror = (error) => {
        const eventSource = error.target as EventSource;
        const readyState = eventSource?.readyState;

        // EventSource.readyState: 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
        if (readyState === 2) {
          log(
            "warn",
            "[Flagix SDK] SSE connection closed. Attempting to reconnect..."
          );
          this.handleReconnect();
        } else if (readyState === 0) {
          log(
            "warn",
            "[Flagix SDK] SSE connection error (connecting state)",
            error
          );
        } else {
          log("error", "[Flagix SDK] SSE error", error);
          this.handleReconnect();
        }
      };

      // Listen for the "connected" event from the server
      source.addEventListener("connected", () => {
        log("info", "[Flagix SDK] SSE connection confirmed by server.");
      });

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
    } catch (error) {
      log("error", "[Flagix SDK] Failed during SSE setup", error);
      this.handleReconnect();
    } finally {
      this.isConnectingSSE = false;
    }
  }

  private handleReconnect(): void {
    if (this.isReconnecting || !this.isInitialized) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      log(
        "error",
        "[Flagix SDK] Max reconnection attempts reached. Stopping reconnection."
      );
      return;
    }

    this.isReconnecting = true;
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
    }

    // Calculate exponential backoff delay with jitter
    const delay = Math.min(
      this.baseReconnectDelay * 2 ** this.reconnectAttempts,
      this.maxReconnectDelay
    );
    // Add ±25% jitter to prevent thundering herd
    const jitter = delay * 0.25 * (Math.random() * 2 - 1);
    const finalDelay = Math.max(100, delay + jitter);

    this.reconnectAttempts++;

    log(
      "info",
      `[Flagix SDK] Scheduling SSE reconnection attempt ${this.reconnectAttempts} in ${Math.round(finalDelay)}ms...`
    );

    this.reconnectTimeoutId = setTimeout(() => {
      this.isReconnecting = false;
      this.reconnectTimeoutId = null;
      this.setupSSEListener().catch((error) => {
        log("error", "[Flagix SDK] Failed to reconnect SSE", error);
        this.handleReconnect();
      });
    }, finalDelay);
  }

  private async fetchSingleFlagConfig(
    flagKey: string,
    type: FlagUpdateType
  ): Promise<void> {
    const url = `${this.apiBaseUrl}/api/flag-config/${flagKey}`;

    if (type === "FLAG_DELETED") {
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
    const distinctId = resolveIdentifier(finalContext);

    const payload = {
      apiKey: this.apiKey,
      event_name: eventName,
      distinctId,
      properties: properties || {},
      timestamp: new Date().toISOString(),
    };

    const payloadJson = JSON.stringify(payload);

    this.fireAndForgetFetch(url, payloadJson);
  }

  /**
   * Closes the Server-Sent Events (SSE) connection and cleans up resources.
   */
  close(): void {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    this.isReconnecting = false;
    this.reconnectAttempts = 0;
    this.hasEstablishedConnection = false;

    if (this.sseConnection) {
      try {
        this.sseConnection.close();
      } catch (error) {
        log("warn", "[Flagix SDK] Error closing SSE connection", error);
      }
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

    const distinctId = resolveIdentifier(context);

    const payload = {
      apiKey: this.apiKey,
      flagKey,
      variationName: result.name,
      variationValue: result.value,
      variationType: result.type,
      distinctId,
      evaluationContext: context,
      evaluatedAt: new Date().toISOString(),
    };

    const payloadJson = JSON.stringify(payload);

    this.fireAndForgetFetch(url, payloadJson);
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
