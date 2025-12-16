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

  // Initial State: Handle the evaluation only when the client is ready
  const [value, setValue] = useState<T | null>(() =>
    isReady && client ? evaluateValue<T>(flagKey, client) : null
  );

  console.log("value in use-flag hook ==>", value);

  // Memoize the update handler to prevent useEffect from re-running unnecessarily
  const handleFlagUpdate = useCallback(
    (updatedFlagKey: string) => {
      if (!client) {
        console.log("handleFlagUpdate called but no client");
        return;
      }

      if (updatedFlagKey === flagKey) {
        console.log("handleFlagUpdate called and running ==>", client);
        const newValue = evaluateValue<T>(flagKey, client);
        console.log("newValue ==>", newValue);

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

    // Set the correct value once initialized (in case of async initialization)
    setValue(evaluateValue<T>(flagKey, client));

    // Subscribe to the SDK's update event
    client.onFlagUpdate(handleFlagUpdate);

    // Cleanup function: unsubscribe when the component unmounts
    return () => {
      client.offFlagUpdate(handleFlagUpdate);
    };
  }, [isReady, client, handleFlagUpdate, flagKey]);

  return value;
}
