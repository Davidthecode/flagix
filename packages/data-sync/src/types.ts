import type {
  EnvironmentRule,
  Flag,
  FlagState,
  Variation,
} from "@flagix/db/client";

export type DbFlagWithRules = Flag & {
  variations: Variation[];
  states: FlagState[];
  rules: EnvironmentRule[];
};

export type EnvironmentAndProjectIds = {
  environmentId: string;
  projectId: string;
};
