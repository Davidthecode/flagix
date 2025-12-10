// biome-ignore lint/performance/noBarrelFile: Used for a unified API surface in this internal package.
export {
  getFlagConfig,
  REDIS_CHANNEL,
  reloadFlagData,
  resolveEnvironmentId,
} from "./data-sync";

export { evaluateFlag } from "./evaluator";

export type { EvaluationContext, FlagVariation } from "./types";
