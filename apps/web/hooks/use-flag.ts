"use client";

import type { Flagix } from "@flagix/js-sdk";
import { useCallback, useEffect, useState } from "react";
import { useFlagix } from "@/providers/flagix";

type VariationValue = boolean | string | number;

const evaluateValue = <T extends VariationValue>(
  flagKey: string,
  client: typeof Flagix
): T | null => client.evaluate<T>(flagKey);

export function useFlag<T extends VariationValue>(flagKey: string): T | null {
  const { isReady, client } = useFlagix();

  const [value, setValue] = useState<T | null>(() =>
    isReady && client ? evaluateValue<T>(flagKey, client) : null
  );

  const handleFlagUpdate = useCallback(
    (updatedFlagKey: string) => {
      if (!client) {
        return;
      }

      if (updatedFlagKey === flagKey) {
        const newValue = evaluateValue<T>(flagKey, client);

        setValue(newValue);
      }
    },
    [flagKey, client]
  );

  useEffect(() => {
    if (!isReady || !client) {
      setValue(null);
      return;
    }

    setValue(evaluateValue<T>(flagKey, client));

    client.onFlagUpdate(handleFlagUpdate);

    return () => {
      client.offFlagUpdate(handleFlagUpdate);
    };
  }, [isReady, client, handleFlagUpdate, flagKey]);

  return value;
}
