import type {
  EnvironmentRule,
  Flag,
  FlagState,
  Variation,
} from "@flagix/db/client";
import type { FlagConfig } from "@flagix/evaluation-core";

export type DbFlagWithRules = Flag & {
  variations: Variation[];
  states: FlagState[];
  rules: EnvironmentRule[];
};

export type EngineCache = Map<string, FlagConfig>;
