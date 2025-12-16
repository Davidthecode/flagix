"use client";

import { Flagix, type FlagixClientOptions } from "@flagix/js-sdk";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// create context for the client and initialization status
const FlagixContext = createContext<{
  isReady: boolean;
  client: typeof Flagix | null;
}>({
  isReady: false,
  client: null,
});

export const FlagixProvider: React.FC<{
  children: React.ReactNode;
  options: FlagixClientOptions;
}> = ({ children, options }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (Flagix.isInitialized()) {
      console.log("flagix initialized, isReady");
      setIsReady(true);
    } else {
      Flagix.initialize(options)
        .then(() => setIsReady(true))
        .catch((error) => console.error("Flagix Init Error:", error));
    }

    return () => {
      Flagix.close();
      setIsReady(false);
    };
  }, [options]);

  return (
    <FlagixContext.Provider value={{ isReady, client: Flagix }}>
      {children}
    </FlagixContext.Provider>
  );
};

export const useFlagix = () => {
  const context = useContext(FlagixContext);
  if (!context) {
    throw new Error("useFlagix must be used within FlagixProvider");
  }
  return context;
};
