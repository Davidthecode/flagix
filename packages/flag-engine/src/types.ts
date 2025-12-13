import type {
  EnvironmentRule,
  Flag,
  FlagState,
  Variation,
} from "@flagix/db/client";

// biome-ignore lint/suspicious/noExplicitAny: The evaluation context must accept arbitrary user-defined attributes passed by the client.
export type EvaluationContext = Record<string, any>;

export type VariationTypeLabel = "boolean" | "string" | "number";
export type VariationValue = boolean | string | number;

// Single condition structure
export type RuleCondition = {
  attribute: string; // e.g., 'user.country'
  operator: string; // e.g., 'in', 'startsWith', '=='
  value: string; // e.g., 'US,CA' or 'admin'
};

export type EngineRule = {
  id: string;
  order: number;
  type: "targeting" | "experiment";
  conditions: RuleCondition[];
  rolloutPercentage?: number;
  variationId?: string; // For targeting
  distribution?: Array<{ variationId: string; weight: number }>; // For experiment
};

export type FlagVariation = {
  id: string;
  name: string;
  value: VariationValue;
  type: VariationTypeLabel;
};

export type FlagConfig = {
  key: string;
  enabled: boolean;
  defaultVariation: FlagVariation;
  variations: FlagVariation[];
  rules: EngineRule[];
};

export type EngineCache = Map<string, FlagConfig>;

export type DbFlagWithRules = Flag & {
  variations: Variation[];
  states: FlagState[];
  rules: EnvironmentRule[];
};
