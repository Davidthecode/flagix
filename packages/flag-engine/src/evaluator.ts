import crypto from "node:crypto";
import type {
  EngineRule,
  EvaluationContext,
  FlagConfig,
  FlagVariation,
} from "./types";

export function evaluateConditions(
  conditions: EngineRule["conditions"],
  context: EvaluationContext
): boolean {
  if (conditions.length === 0) {
    return true;
  }

  const NUMERIC_OPERATORS = [">", ">=", "<", "<="];

  return conditions.every((condition) => {
    const { attribute, operator, value } = condition;

    const contextValue = getNestedValue(context, attribute);
    if (contextValue === undefined) {
      return false;
    }

    if (NUMERIC_OPERATORS.includes(operator)) {
      return evaluateNumericConditions(contextValue, operator, value);
    }
    return evaluateStringAndInConditions(contextValue, operator, value);
  });
}

/**
 * Handles numeric comparisons: >, >=, <, <=
 */
function evaluateNumericConditions(
  contextValue: unknown,
  operator: string,
  value: string
): boolean {
  const num1 = Number(contextValue);
  const num2 = Number(value);

  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    console.warn(
      `[FlagEngine] Numeric comparison failed: Context value "${contextValue}" or rule value "${value}" is not a valid number.`
    );
    return false;
  }

  switch (operator) {
    case ">":
      return num1 > num2;
    case ">=":
      return num1 >= num2;
    case "<":
      return num1 < num2;
    case "<=":
      return num1 <= num2;
    default:
      console.warn(`[FlagEngine] Unknown numeric operator: ${operator}`);
      return false;
  }
}

/**
 * Handles string comparisons (==, !=, contains, startsWith, endsWith)
 * and the 'in' operator (supporting both numeric and string lists).
 */
function evaluateStringAndInConditions(
  contextValue: unknown,
  operator: string,
  value: string
): boolean {
  if (operator === "in") {
    const numericList = value.split(",").map((item) => Number(item.trim()));
    const isAllNumeric = numericList.every((n) => !Number.isNaN(n));

    if (isAllNumeric) {
      // Rule value is a valid list of numbers (e.g., [18, 25, 30])
      const contextNum = Number(contextValue);
      if (!Number.isNaN(contextNum)) {
        // Context value is also a valid number
        return numericList.includes(contextNum);
      }

      return false;
    }
    // If the rule value is not a clean list of numbers, fall through to string comparison.
  }

  const valueOne = String(contextValue).toLowerCase();
  const valueTwo = String(value).toLowerCase();

  switch (operator) {
    case "==":
      return valueOne === valueTwo;
    case "!=":
      return valueOne !== valueTwo;
    case "contains":
      return valueOne.includes(valueTwo);
    case "startsWith":
      return valueOne.startsWith(valueTwo);
    case "endsWith":
      return valueOne.endsWith(valueTwo);
    case "in": {
      const listToCheck = valueTwo.split(",").map((item) => item.trim());
      return listToCheck.includes(valueOne);
    }
    default:
      console.warn(`[FlagEngine] Unknown operator: ${operator}`);
      return false;
  }
}

/**
 * Safely retrieves a nested property value from an object using a dot-separated path (e.g., 'user.country').
 * Returns undefined if any intermediate property in the path is missing.
 */
// biome-ignore lint/suspicious/noExplicitAny: The return type is dynamically determined by the path string, which is unknown at compile time.
function getNestedValue(obj: EvaluationContext, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

/**
 * Creates a consistent bucket number (0-99) for a given identifier (like user ID).
 * This ensures the same user always lands in the same A/B test bucket.
 * @param identifier The unique string ID (e.g., user.id).
 * @returns A number between 0 and 99.
 */
function getConsistentBucket(identifier: string): number {
  const hash = crypto.createHash("sha256").update(identifier).digest("hex");

  // Take the first 8 characters of the hex hash
  // Taking 8 chars gives us 32 bits of entropy.
  const entropyPart = hash.substring(0, 8);

  // Convert the hex string to an integer
  const decimalValue = Number.parseInt(entropyPart, 16);

  // Map the integer to a bucket between 0 and 99
  return decimalValue % 100;
}

/**
 * Handles the gradual rollout and A/B test distribution logic for a single rule.
 */
function resolveRuleVariation(
  rule: EngineRule,
  config: FlagConfig,
  context: EvaluationContext
): FlagVariation | null {
  const bucketingId =
    getNestedValue(context, "user.id") || context.sessionId || rule.id;

  const bucket = getConsistentBucket(String(bucketingId));

  // Apply Rollout Percentage for Gradual Rollout
  if (rule.type === "targeting") {
    const rollout = rule.rolloutPercentage ?? 100;

    if (bucket < rollout) {
      return (
        config.variations.find((v) => v.id === rule.variationId) ??
        config.defaultVariation
      );
    }
  }

  // Handle A/B Experiment Distribution
  if (rule.type === "experiment") {
    let cumulativeWeight = 0;

    // Iterate through splits to find the bucket the user lands in
    for (const split of rule.distribution ?? []) {
      cumulativeWeight += split.weight;

      if (bucket < cumulativeWeight) {
        return (
          config.variations.find((v) => v.id === split.variationId) ??
          config.defaultVariation
        );
      }
    }
  }

  return null;
}

export function evaluateFlag(
  config: FlagConfig,
  context: EvaluationContext
): FlagVariation | null {
  if (!config.enabled) {
    return config.defaultVariation;
  }

  for (const rule of config.rules) {
    if (evaluateConditions(rule.conditions, context)) {
      const variation = resolveRuleVariation(rule, config, context);

      if (variation) {
        return variation;
      }
    }
  }

  return config.defaultVariation;
}
