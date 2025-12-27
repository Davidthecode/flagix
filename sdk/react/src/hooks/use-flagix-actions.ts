"use client";

import { Flagix } from "@flagix/js-sdk";

/**
 * Hook to track events
 */
export function useFlagixActions() {
  return {
    track: Flagix.track.bind(Flagix),
    setContext: Flagix.setContext.bind(Flagix),
  };
}
