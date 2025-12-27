import type { EvaluationContext } from "@flagix/evaluation-core";
import type { LogLevel } from "@/lib/logger";

export type {
  EvaluationContext,
  FlagConfig,
  FlagVariation,
  VariationValue,
} from "@flagix/evaluation-core";

export type FlagixClientOptions = {
  /** The API Key for the environment */
  apiKey: string;
  /** The base URL for the flag evaluation API  */
  apiBaseUrl: string;
  /** Optional context attributes  */
  initialContext?: EvaluationContext;
  /** Enable SDK logging */
  logs?: {
    level?: LogLevel; // default: "none"
  };
};
