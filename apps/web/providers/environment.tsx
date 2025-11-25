"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { BaseEnvironment } from "@/types/environment";

interface EnvironmentContextType {
  currentEnvironment: BaseEnvironment | null;
  setCurrentEnvironment: (env: BaseEnvironment) => void;
  allEnvironments: BaseEnvironment[];
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = "flagix_current_env";

interface CurrentEnvironmentProviderProps {
  children: ReactNode;
  initialEnvironments: BaseEnvironment[];
  projectId: string;
}

export const CurrentEnvironmentProvider = ({
  children,
  initialEnvironments,
  projectId,
}: CurrentEnvironmentProviderProps) => {
  const [currentEnvironment, setCurrentEnvironmentState] =
    useState<BaseEnvironment | null>(null);

  useEffect(() => {
    if (!initialEnvironments.length) {
      return;
    }

    // Key includes projectId to prevent mixing environments between projects
    const persistentKey = `${LOCAL_STORAGE_KEY}_${projectId}`;
    const storedEnvName = localStorage.getItem(persistentKey);

    if (storedEnvName) {
      const storedEnv = initialEnvironments.find(
        (env) => env.name === storedEnvName
      );

      if (storedEnv) {
        setCurrentEnvironmentState(storedEnv);
        return;
      }
    }

    // If no valid stored environment, default to the first one
    setCurrentEnvironmentState(initialEnvironments[0]);
  }, [initialEnvironments, projectId]);

  const setCurrentEnvironment = useCallback(
    (env: BaseEnvironment) => {
      setCurrentEnvironmentState(env);

      const persistentKey = `${LOCAL_STORAGE_KEY}_${projectId}`;
      localStorage.setItem(persistentKey, env.name);
    },
    [projectId]
  );

  const resolvedEnvironment =
    currentEnvironment ??
    (initialEnvironments.length > 0 ? initialEnvironments[0] : null);

  const contextValue: EnvironmentContextType = {
    currentEnvironment: resolvedEnvironment,
    setCurrentEnvironment,
    allEnvironments: initialEnvironments,
  };

  return (
    <EnvironmentContext.Provider value={contextValue}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useCurrentEnvironment = (): EnvironmentContextType => {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentEnvironment must be used within a CurrentEnvironmentProvider"
    );
  }
  return context;
};
