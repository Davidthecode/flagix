import type {
  EvaluationContext,
  VariationValue,
} from "@flagix/evaluation-core";
import { FlagixClient } from "./client";
import type { FlagixClientOptions } from "./types";

let clientInstance: FlagixClient | null = null;

let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

export const Flagix = {
  /**
   * Initializes the Flagix SDK, fetches all flags, and sets up an SSE connection.
   */
  async initialize(options: FlagixClientOptions): Promise<void> {
    if (clientInstance) {
      console.warn("Flagix SDK already initialized.");
      return;
    }

    if (isInitializing && initializationPromise) {
      return initializationPromise;
    }

    isInitializing = true;

    try {
      clientInstance = new FlagixClient(options);
      initializationPromise = clientInstance.initialize();
      await initializationPromise;
    } catch (error) {
      console.error("Flagix SDK failed during initialization:", error);
      throw error;
    } finally {
      isInitializing = false;
      initializationPromise = null;
    }
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
      console.error(
        "Flagix SDK not initialized. Call Flagix.initialize() first."
      );
      return null;
    }
    return clientInstance.evaluate<T>(flagKey, contextOverrides);
  },

  /**
   * Sets or updates the global evaluation context.
   * @param newContext New context attributes to merge or replace.
   */
  setContext(newContext: EvaluationContext): void {
    if (!clientInstance) {
      console.error("Flagix SDK not initialized.");
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
    }
  },

  /**
   * checks initialization status
   */
  isInitialized(): boolean {
    return !!clientInstance && clientInstance.getIsInitialized();
  },
};

// biome-ignore lint/performance/noBarrelFile: <>
export * from "./types";
