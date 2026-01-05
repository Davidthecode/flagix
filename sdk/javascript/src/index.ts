import { FlagixClient } from "@/client";
import { FLAG_UPDATE_EVENT } from "@/lib/emitter";
import { log } from "@/lib/logger";
import type {
  EvaluationContext,
  InternalFlagixOptions,
  VariationValue,
} from "@/types";

let clientInstance: FlagixClient | null = null;

let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

export const Flagix = {
  /**
   * Initializes the Flagix SDK, fetches all flags, and sets up an SSE connection.
   */
  async initialize(options: InternalFlagixOptions): Promise<void> {
    // this check ensures that we are able to watch for api key changes and re-initialize accordingly
    // this ensures we dont use stale clients across different api keys
    if (clientInstance) {
      if (clientInstance.getApiKey() === options.apiKey) {
        if (clientInstance.getIsInitialized()) {
          return;
        }

        if (isInitializing && initializationPromise) {
          return initializationPromise;
        }
      } else {
        log(
          "info",
          "[Flagix SDK] API Key change detected. Resetting client..."
        );
        this.close();
      }
    }

    if (isInitializing && initializationPromise) {
      return initializationPromise;
    }

    isInitializing = true;

    initializationPromise = (async () => {
      try {
        clientInstance = new FlagixClient(options);
        await clientInstance.initialize();
      } catch (error) {
        clientInstance = null;
        throw error;
      } finally {
        isInitializing = false;
      }
    })();

    return await initializationPromise;
  },

  /**
   * Evaluates a flag based on the local cache and current context.
   * @param flagKey The key of the flag to evaluate.
   * @param contextOverrides Optional, temporary context overrides.
   */
  evaluate<T extends VariationValue>(
    flagKey: string,
    contextOverrides?: EvaluationContext
  ): T | null {
    if (!clientInstance || !clientInstance.getIsInitialized()) {
      log(
        "error",
        "Flagix SDK not initialized. Call Flagix.initialize() first."
      );

      return null;
    }
    return clientInstance.evaluate<T>(flagKey, contextOverrides);
  },

  /**
   * Records a custom event for analytics.
   * @param eventName The name of the event.
   * @param properties Optional custom metadata.
   * @param contextOverrides Optional context.
   */
  track(
    eventName: string,
    properties?: Record<string, unknown>,
    contextOverrides?: EvaluationContext
  ): void {
    if (!clientInstance) {
      log(
        "error",
        "Flagix SDK not initialized. Call Flagix.initialize() first."
      );
      return;
    }
    clientInstance.track(eventName, properties, contextOverrides);
  },

  /**
   * Replaces the global evaluation context.
   */
  identify(newContext: EvaluationContext): void {
    if (!clientInstance) {
      log("error", "Flagix SDK not initialized.");
      return;
    }
    clientInstance.identify(newContext);
  },

  /**
   * Sets or updates the global evaluation context.
   * @param newContext New context attributes to merge or replace.
   */
  setContext(newContext: EvaluationContext): void {
    if (!clientInstance) {
      log("error", "Flagix SDK not initialized.");
      return;
    }
    clientInstance.setContext(newContext);
  },

  /**
   * Closes the SSE connection and cleans up resources.
   */
  close(): void {
    if (clientInstance) {
      clientInstance.close();
      clientInstance = null;
      initializationPromise = null;
      isInitializing = false;
    }
  },

  /**
   * checks initialization status
   */
  isInitialized(): boolean {
    return !!clientInstance && clientInstance.getIsInitialized();
  },

  /**
   * Subscribes a listener to updates for any flag.
   * @param listener The callback function (receives the updated flagKey).
   */
  onFlagUpdate(listener: (flagKey: string) => void): void {
    if (!clientInstance) {
      log("warn", "Flagix SDK not initialized. Cannot subscribe to updates.");
      return;
    }
    clientInstance.on(FLAG_UPDATE_EVENT, listener);
  },

  /**
   * Unsubscribes a listener from flag updates.
   * @param listener The callback function to remove.
   */
  offFlagUpdate(listener: (flagKey: string) => void): void {
    if (!clientInstance) {
      return;
    }
    clientInstance.off(FLAG_UPDATE_EVENT, listener);
  },
};

// biome-ignore lint/performance/noBarrelFile: <>
export * from "./types";
