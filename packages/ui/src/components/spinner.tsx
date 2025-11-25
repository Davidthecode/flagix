"use client";

import { Loader2 } from "lucide-react";
import type React from "react";

interface SpinnerProps {
  className?: string;
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 20 }) => (
  <Loader2 className={`animate-spin ${className}`} size={size} />
);
