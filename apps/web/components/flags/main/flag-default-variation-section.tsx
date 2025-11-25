import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@flagix/ui/components/select";
import { Lock } from "lucide-react";
import type { FlagVariation } from "@/types/flag";

type FlagDefaultVariationSectionProps = {
  variations: FlagVariation[];
  defaultVariationName: string;
  isEditable: boolean;
  isAnyMutationPending: boolean;
  onSetDefaultVariation: (newDefaultName: string) => void;
};

export function FlagDefaultVariationSection({
  variations,
  defaultVariationName,
  isEditable,
  isAnyMutationPending,
  onSetDefaultVariation,
}: FlagDefaultVariationSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-stone-100">
      <h2 className="font-semibold text-gray-900 text-lg">Default Variation</h2>
      <p className="mb-3 text-gray-500 text-xs">
        This value is returned if the flag is enabled but no targeting rules are
        matched.
      </p>

      <Select
        disabled={!isEditable || isAnyMutationPending}
        onValueChange={onSetDefaultVariation}
        value={defaultVariationName}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose default variation" />
        </SelectTrigger>
        <SelectContent>
          {variations.map((v) => (
            <SelectItem key={v.name} value={v.name}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{v.name}</span>
                <span className="text-gray-500 text-xs">
                  "{v.value.toString()}"
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!isEditable && (
        <p className="mt-2 flex items-center gap-1 text-gray-500 text-xs italic">
          <Lock className="h-3 w-3" />
          Read-Only in this environment.
        </p>
      )}
    </div>
  );
}
