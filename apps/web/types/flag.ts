export type FlagVariation = {
  name: string;
  value: string;
  type: string;
};

export type Condition = {
  id: string;
  attribute: string;
  operator: string;
  value: string;
};

export type VariationSplit = {
  variation: string;
  percentage: number;
};

export type TargetingRule = {
  id?: string;
  description: string;
  ruleType: "targeting" | "experiment";
  targetVariation?: string;
  rolloutPercentage?: number;
  variationSplits?: VariationSplit[];
  conditions: Condition[];
};

export type EnvironmentConfig = {
  isEnabled: boolean;
  targetingRules: TargetingRule[];
  defaultVariationName: string;
};

export type FlagConfig = {
  id: string;
  key: string;
  description: string;
  createdAt: string;
  variations: FlagVariation[];
  defaultVariation: FlagVariation;
  environments: Record<string, EnvironmentConfig>;
};

export type FlagType = {
  id: string;
  key: string;
  description: string;
  environments: Record<string, boolean>;
  updatedAt: string;
};

export type StatusSummary = {
  envName: string;
  isEnabled: boolean;
};
