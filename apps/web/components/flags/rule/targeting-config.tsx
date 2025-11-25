"use client";

import { Input } from "@flagix/ui/components/input";
import { Label } from "@flagix/ui/components/label";

type TargetingConfigProps = {
  availableVariations: { name: string; value: string }[];
  targetVariation: string;
  rolloutPercentage: number;
  onTargetChange: (v: string) => void;
  onRolloutChange: (v: number) => void;
};

export const TargetingConfig = ({
  availableVariations,
  targetVariation,
  rolloutPercentage,
  onTargetChange,
  onRolloutChange,
}: TargetingConfigProps) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="targetVariation">Target Variation (Result)</Label>
      <select
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm capitalize focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        id="targetVariation"
        onChange={(e) => onTargetChange(e.target.value)}
        value={targetVariation}
      >
        {availableVariations.map((availableVariation) => (
          <option key={availableVariation.name} value={availableVariation.name}>
            {availableVariation.name} ("{availableVariation.value.toString()}")
          </option>
        ))}
      </select>
      <p className="text-gray-500 text-xs">
        The flag value returned when this rule matches.
      </p>
    </div>

    <div className="space-y-2">
      <Label>
        Rollout Percentage:{" "}
        <span className="font-semibold">{rolloutPercentage}%</span>
      </Label>
      <div className="flex items-center gap-3">
        <input
          className="h-2 flex-1 cursor-pointer appearance-none rounded-lg [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
          max={100}
          min={0}
          onChange={(e) => onRolloutChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${rolloutPercentage}%, rgb(229, 231, 235) ${rolloutPercentage}%, rgb(229, 231, 235) 100%)`,
          }}
          type="range"
          value={rolloutPercentage}
        />
        <Input
          className="w-20"
          max={100}
          min={0}
          onChange={(e) => onRolloutChange(Number(e.target.value))}
          type="number"
          value={rolloutPercentage}
        />
      </div>
      <p className="text-gray-500 text-xs">
        Percentage of matching traffic that receives the target variation.
      </p>
    </div>
  </>
);
