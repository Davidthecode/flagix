"use client";

import { useParams } from "next/navigation";
import { createContext, useContext } from "react";

interface FlagContextType {
  flagId: string;
}

const FlagContext = createContext<FlagContextType | null>(null);

export function FlagProvider({ children }: { children: React.ReactNode }) {
  const params = useParams<{ flag: string }>();

  const flagId = Array.isArray(params.flag) ? params.flag[0] : params.flag;

  return (
    <FlagContext.Provider value={{ flagId }}>{children}</FlagContext.Provider>
  );
}

export const useFlag = () => {
  const context = useContext(FlagContext);
  if (!context) {
    throw new Error("useFlag must be used within FlagProvider");
  }
  return context;
};
