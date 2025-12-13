import {
  type EvaluationContext,
  evaluateFlag,
  type FlagConfig,
  type VariationValue,
} from "@flagix/evaluation-core";
import {
  EVENT_TO_LISTEN,
  type FlagUpdateType,
  REMOVE_TRAILING_SLASH,
} from "@/constants";
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

  constructor(options: FlagixClientOptions) {
    this.apiKey = options.apiKey;
    this.apiBaseUrl = options.apiBaseUrl.replace(REMOVE_TRAILING_SLASH, "");
    this.context = options.initialContext || {};
  }

  /**
   * Fetches all flag configurations from the API, populates the local cache,
   * and sets up the SSE connection for real-time updates.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log("[Flagix SDK] Starting initialization...");

    await this.fetchInitialConfig();
    this.setupSSEListener();

    this.isInitialized = true;
    console.log("[Flagix SDK] Initialization complete.");
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
      console.warn(
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

    return (result?.value as T) ?? null;
  }

  /**
   * Sets or updates the global evaluation context.
   * @param newContext New context attributes to merge or replace.
   */
  setContext(newContext: EvaluationContext): void {
    this.context = { ...this.context, ...newContext };
    console.log(
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
      console.log(`[Flagix SDK] Loaded ${this.localCache.size} flag configs.`);
    } catch (error) {
      console.error(
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
      console.log("[Flagix SDK] SSE connection established.");
    };

    source.onerror = (error) => {
      console.error("[Flagix SDK] SSE error.", error);
    };

    source.addEventListener(EVENT_TO_LISTEN, (event) => {
      try {
        const data = JSON.parse(event.data);
        const { flagKey, type } = data as {
          flagKey: string;
          type: FlagUpdateType;
        };

        console.log(`[Flagix SDK] Received update for ${flagKey} (${type}).`);

        this.fetchSingleFlagConfig(flagKey, type);
      } catch (error) {
        console.error("[Flagix SDK] Failed to parse SSE event data.", error);
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
      console.log(`[Flagix SDK] Flag ${flagKey} deleted from cache.`);
      return;
    }

    try {
      const response = await fetch(url, {
        headers: { "X-Api-Key": this.apiKey },
      });

      if (response.status === 404) {
        this.localCache.delete(flagKey);
        console.log(
          `[Flagix SDK] Flag ${flagKey} not found on API, deleted from cache.`
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch update for ${flagKey}: ${response.statusText}`
        );
      }

      const config = (await response.json()) as FlagConfig;

      this.localCache.set(flagKey, config);
      console.log(`[Flagix SDK] Flag ${flagKey} updated/synced.`);
    } catch (error) {
      console.error(
        `[Flagix SDK] Failed to fetch update for ${flagKey}.`,
        error
      );
    }
  }

  /**
   * Closes the Server-Sent Events (SSE) connection and cleans up resources.
   */
  close(): void {
    if (this.sseConnection) {
      this.sseConnection.close();
      this.sseConnection = null;
      console.log("[Flagix SDK] SSE connection closed.");
    }

    this.localCache.clear();
    this.isInitialized = false;
  }
}
