import { Button } from "@flagix/ui/components/button";
import { Globe } from "lucide-react";
import type { FlagVariation } from "@/types/flag";

type FlagVariationsSectionProps = {
  variations: FlagVariation[];
  isAnyMutationPending: boolean;
  onManageClick: () => void;
};

export function FlagVariationsSection({
  variations,
  isAnyMutationPending,
  onManageClick,
}: FlagVariationsSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-stone-100">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900 text-lg">
            Flag Variations
          </h2>
          <div className="border-gray-200">
            <div className="flex w-fit items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800 text-xs">
              <Globe className="h-3 w-3" />
              <span className="text-semibold">Global</span>
            </div>
          </div>
        </div>
        <Button
          className="bg-emerald-600 p-2 text-white text-xs hover:bg-emerald-700"
          disabled={isAnyMutationPending}
          onClick={onManageClick}
        >
          Manage Variations
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {variations.map((variation) => (
          <div
            className="rounded-lg border border-gray-200 bg-[#F2F2F2] px-3 py-1"
            key={variation.name}
          >
            <span className="font-mono text-gray-900 text-sm">
              {variation.name}:
            </span>
            <span className="ml-2 font-mono text-emerald-700 text-xs">
              "{variation.value.toString()}"
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
