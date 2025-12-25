export type FlagVariation = {
  id: string;
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
  variationId: string;
  weight: number;
};

// we have this cause we previously stored variation split as
// variation and percentage
// but weve since changed to `VariationSplit` type -> variationId and weight as it represents it better
export type OldVariationSplit = {
  variation?: string;
  percentage?: number;
} & Partial<VariationSplit>;

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
