import type { Variation } from "@flagix/db/client";
import type {
  DbFlagWithRules,
  EngineRule,
  FlagConfig,
  FlagVariation,
  VariationTypeLabel,
  VariationValue,
} from "@/types";

/**
 * Parses the raw value from the db based on the stored type label.
 */
function parseVariationValue(
  // biome-ignore lint/suspicious/noExplicitAny: RawValue comes from a db JSON column (JsonValue) and must be handled as an indeterminate type before parsing.
  rawValue: any,
  typeLabel: string
): VariationValue | undefined {
  if (rawValue === null || rawValue === undefined) {
    return;
  }

  let parsedValue: VariationValue;
  try {
    parsedValue = JSON.parse(String(rawValue));
  } catch {
    parsedValue = rawValue;
  }

  switch (typeLabel) {
    case "boolean":
      return (
        parsedValue === true || String(parsedValue).toLowerCase() === "true"
      );

    case "number": {
      const num = Number(parsedValue);
      return Number.isNaN(num) ? undefined : num;
    }

    case "string": {
      const str = String(parsedValue);
      return str.length > 0 ? str : undefined;
    }

    default:
      console.warn(`[FlagEngine Parser] Unknown variation type: ${typeLabel}.`);
      return;
  }
}

/**
 * Validates and converts a raw database Variation object into the strict FlagVariation type.
 * Ensures the value conforms to the expected primitive type (boolean, string, number)
 * and is not null or undefined.
 */
function mapDbVariationToEngine(v: Variation): FlagVariation | undefined {
  const typeLabel = v.type as VariationTypeLabel;

  const finalValue = parseVariationValue(v.value, typeLabel);

  if (finalValue === undefined) {
    console.warn(
      `[FlagEngine Parser] Variation ID ${v.id} for Flag ${v.flagId} has an unparsable or invalid value and will be ignored.`
    );
    return;
  }
  return {
    id: v.id,
    name: v.name,
    value: finalValue,
    type: typeLabel,
  };
}

export function mapDbFlagToEngineConfig(
  flag: DbFlagWithRules,
  environmentId: string
): FlagConfig | undefined {
  const state = flag.states.find((s) => s.environmentId === environmentId);
  if (!state) {
    return;
  }

  const allVariations: FlagVariation[] = flag.variations
    .map(mapDbVariationToEngine)
    .filter((v): v is FlagVariation => v !== undefined);

  const defaultVariation = allVariations.find(
    (v) => v.id === state.defaultVariationId
  );
  if (!defaultVariation) {
    console.error(
      `[FlagEngine Parser] Default variation ID ${state.defaultVariationId} not found or is invalid for Flag ${flag.key}.`
    );
    return;
  }

  const rules: EngineRule[] = flag.rules.map((rule) => ({
    id: rule.id,
    order: rule.order,
    type: rule.type as "targeting" | "experiment",
    conditions: (rule.conditions as EngineRule["conditions"]) || [],
    rolloutPercentage: rule.rolloutPercentage ?? undefined,
    variationId: rule.variationId ?? undefined,
    distribution:
      (rule.distribution as EngineRule["distribution"]) || undefined,
  }));

  return {
    key: flag.key,
    enabled: state.enabled,
    defaultVariation,
    variations: allVariations,
    rules,
  };
}
