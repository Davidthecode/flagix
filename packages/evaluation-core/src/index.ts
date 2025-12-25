// biome-ignore lint/performance/noBarrelFile: <>
export { evaluateFlag, resolveIdentifier } from "./evaluator";

export type {
  EngineRule,
  EvaluationContext,
  FlagConfig,
  FlagVariation,
  RuleCondition,
  VariationTypeLabel,
  VariationValue,
} from "./types";
