import { cn } from "@flagix/ui/lib/utils";
import type React from "react";

interface AnalyticsCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AnalyticsCard = ({ children, className }: AnalyticsCardProps) => (
  <div
    className={cn(
      "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
      className
    )}
  >
    {children}
  </div>
);
