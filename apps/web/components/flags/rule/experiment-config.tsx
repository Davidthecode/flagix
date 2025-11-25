"use client";

import { Button } from "@flagix/ui/components/button";
import { Input } from "@flagix/ui/components/input";
import { Label } from "@flagix/ui/components/label";
import { AlertCircle, Plus, X } from "lucide-react";

type ExperimentConfigProps = {
  variationSplits: { variation: string; percentage: number }[];
  availableVariations: { name: string; value: string }[];
  onUpdateSplit: (index: number, percentage: number) => void;
  onUpdateSplitName: (index: number, name: string) => void;
  onAddSplit: () => void;
  onRemoveSplit: (index: number) => void;
  totalPercentage: number;
  error?: string;
};

export const ExperimentConfig = ({
  variationSplits,
  availableVariations,
  onUpdateSplit,
  onAddSplit,
  onRemoveSplit,
  onUpdateSplitName,
  totalPercentage,
  error,
}: ExperimentConfigProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="font-medium text-gray-700 text-sm">
        Variation Splits
      </Label>
      {variationSplits.length < availableVariations.length && (
        <button
          className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700 text-xs hover:bg-emerald-100"
          onClick={onAddSplit}
          type="button"
        >
          <Plus size={14} />
          Add Variation
        </button>
      )}
    </div>

    <div className="space-y-2 rounded-lg border border-gray-200 bg-[#F2F2F2] p-3">
      {variationSplits.map((split, i) => (
        <div
          className="flex items-center gap-3 rounded-md bg-white p-3 shadow-sm"
          key={split.variation}
        >
          <div className="flex-1">
            <select
              className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm capitalize"
              onChange={(e) => {
                onUpdateSplitName(i, e.target.value);
              }}
              value={split.variation}
            >
              {availableVariations.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ("{v.value.toString()}")
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Input
              className="w-16 text-center"
              max={100}
              min={0}
              onChange={(e) => onUpdateSplit(i, Number(e.target.value))}
              type="number"
              value={split.percentage}
            />
            <span className="text-gray-600 text-sm">%</span>
          </div>
          <Button
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            disabled={variationSplits.length <= 2}
            onClick={() => onRemoveSplit(i)}
          >
            <X size={16} />
          </Button>
        </div>
      ))}

      <div className="flex justify-between rounded-md border border-gray-300 bg-white px-3 py-2">
        <span className="font-medium text-gray-700 text-sm">Total</span>
        <span
          className={`font-bold text-sm ${totalPercentage === 100 ? "text-emerald-600" : "text-red-600"}`}
        >
          {totalPercentage}%
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
    <p className="text-gray-500 text-xs">
      Traffic matching conditions will be randomly split across variations based
      on these percentages.
    </p>
  </div>
);
