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
  /** Optional context attributes  */
  initialContext?: EvaluationContext;
  /** Enable SDK logging */
  logs?: {
    level?: LogLevel; // default: "none"
  };
};

export type InternalFlagixOptions = FlagixClientOptions & {
  __internal_baseUrl?: string;
};
