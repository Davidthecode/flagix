import { Button } from "@flagix/ui/components/button";
import { Edit, Globe } from "lucide-react";

type FlagMetadataSectionProps = {
  flagKey: string;
  description: string;
  createdAt: string;
  isAnyMutationPending: boolean;
  onEditClick: () => void;
};

export function FlagMetadataSection({
  flagKey,
  description,
  createdAt,
  isAnyMutationPending,
  onEditClick,
}: FlagMetadataSectionProps) {
  return (
    <div className="flex flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-stone-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900 text-lg">Metadata</h3>
          <div className="border-gray-200">
            <div className="flex w-fit items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800 text-xs">
              <Globe className="h-3 w-3" />
              <span className="text-semibold">Global</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="border-gray-300 p-2 text-gray-700 text-sm hover:bg-[#F2F2F2]"
            disabled={isAnyMutationPending}
            onClick={onEditClick}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-semibold text-gray-900">{flagKey}</h1>
          <p className="mt-1 text-sm">{description}</p>
          <p className="mt-1 text-gray-500 text-xs">Created on {createdAt}</p>
        </div>
      </div>
    </div>
  );
}
