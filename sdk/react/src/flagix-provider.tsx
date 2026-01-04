"use client";

import {
  type EvaluationContext,
  Flagix,
  type FlagixClientOptions,
} from "@flagix/js-sdk";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface FlagixContextType {
  isReady: boolean;
  error: Error | null;
}

const FlagixContext = createContext<FlagixContextType | null>(null);

export interface FlagixProviderProps {
  children: React.ReactNode;
  options: FlagixClientOptions;
  context?: EvaluationContext;
}

export const FlagixProvider = ({
  children,
  options,
  context,
}: FlagixProviderProps) => {
  const [isReady, setIsReady] = useState(() => Flagix.isInitialized());
  const [error, setError] = useState<Error | null>(null);
  const { apiKey, apiBaseUrl } = options;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    let mounted = true;

    Flagix.initialize(options)
      .then(() => {
        if (mounted) {
          setIsReady(true);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err instanceof Error ? err : new Error("Flagix Init Failed")
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, [apiKey, apiBaseUrl]);

  useEffect(() => {
    if (isReady && context) {
      Flagix.setContext(context);
    }
  }, [isReady, context]);

  const value = useMemo(() => ({ isReady, error }), [isReady, error]);

  return (
    <FlagixContext.Provider value={value}>{children}</FlagixContext.Provider>
  );
};

export const useFlagixContext = () => {
  const context = useContext(FlagixContext);
  if (!context) {
    throw new Error("useFlagixContext must be used within a FlagixProvider");
  }
  return context;
};
