"use client";

import { Flagix } from "@flagix/js-sdk";

/**
 * Hook to track events
 */
export function useFlagixActions() {
  return {
    track: Flagix.track.bind(Flagix), // event tracking method
    setContext: Flagix.setContext.bind(Flagix), // method to merge context
    identify: Flagix.identify.bind(Flagix), // method to replace context
  };
}
