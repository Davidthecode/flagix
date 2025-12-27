"use client";

import {
  type EvaluationContext,
  Flagix,
  type VariationValue,
} from "@flagix/js-sdk";
import { useCallback, useEffect, useState } from "react";
import { useFlagixContext } from "@/flagix-provider";

/**
 * Hook to evaluate a feature flag and subscribe to real-time updates.
 */
export function useFlag<T extends VariationValue>(
  flagKey: string,
  contextOverrides?: EvaluationContext
): T | null {
  const { isReady } = useFlagixContext();

  const [value, setValue] = useState<T | null>(() =>
    isReady ? Flagix.evaluate<T>(flagKey, contextOverrides) : null
  );

  const updateValue = useCallback(() => {
    const newValue = Flagix.evaluate<T>(flagKey, contextOverrides);
    setValue(newValue);
  }, [flagKey, contextOverrides]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    updateValue();

    const handler = (updatedKey: string) => {
      if (updatedKey === flagKey) {
        updateValue();
      }
    };

    Flagix.onFlagUpdate(handler);

    return () => {
      Flagix.offFlagUpdate(handler);
    };
  }, [isReady, flagKey, updateValue]);

  return value;
}
