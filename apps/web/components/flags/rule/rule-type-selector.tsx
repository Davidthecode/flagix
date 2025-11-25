"use client";

import { Button } from "@flagix/ui/components/button";
import { Label } from "@flagix/ui/components/label";

type RuleTypeSelectorProps = {
  value: "targeting" | "experiment";
  onChange: (v: "targeting" | "experiment") => void;
  disabled?: boolean;
};

export const RuleTypeSelector = ({
  value,
  onChange,
  disabled,
}: RuleTypeSelectorProps) => (
  <div className="space-y-2">
    <Label className="font-medium text-gray-700 text-sm">Rule Type</Label>
    <div className="grid grid-cols-2 gap-3">
      <Button
        className={`block h-full rounded-lg border-2 p-3 text-left transition-all ${
          value === "targeting"
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={disabled}
        onClick={() => onChange("targeting")}
      >
        <div className="font-medium text-sm">Targeting Rule</div>
        <div className="mt-1 text-gray-600 text-xs">
          Serve one variation to specific users
        </div>
      </Button>
      <Button
        className={`block h-full rounded-lg border-2 p-3 text-left transition-all ${
          value === "experiment"
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={disabled}
        onClick={() => onChange("experiment")}
      >
        <div className="font-medium text-sm">A/B Test</div>
        <div className="mt-1 text-gray-600 text-xs">
          Split traffic across multiple variations
        </div>
      </Button>
    </div>
  </div>
);
