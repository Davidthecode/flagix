"use client";

import { Input } from "@flagix/ui/components/input";
import { Label } from "@flagix/ui/components/label";
import { AlertCircle } from "lucide-react";

type DescriptionInput = {
  value: string;
  error?: string;
  onChange: (v: string) => void;
  ruleType: "targeting" | "experiment";
};

export const DescriptionInput = ({
  value,
  error,
  onChange,
  ruleType,
}: DescriptionInput) => (
  <div className="space-y-2">
    <Label className="font-medium text-gray-700 text-sm" htmlFor="description">
      Rule Description
    </Label>
    <Input
      className={error ? "border-red-500" : ""}
      id="description"
      onChange={(e) => onChange(e.target.value)}
      placeholder={
        ruleType === "targeting"
          ? "e.g., Target 10% of EU users"
          : "e.g., A/B test new checkout flow for premium users"
      }
      value={value}
    />
    {error && (
      <div className="flex items-center gap-1 text-red-600 text-xs">
        <AlertCircle size={12} />
        {error}
      </div>
    )}
  </div>
);
