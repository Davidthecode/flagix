import type { EvaluationContext } from "@flagix/evaluation-core";

export type FlagixClientOptions = {
  /** The API Key for the environment */
  apiKey: string;
  /** The base URL for the flag evaluation API  */
  apiBaseUrl: string;
  /** Optional context attributes  */
  initialContext?: EvaluationContext;
};
