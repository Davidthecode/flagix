import { Button } from "@flagix/ui/components/button";

type FlagDeleteSectionProps = {
  isAnyMutationPending: boolean;
  onDeleteClick: () => void;
};

export function FlagDeleteSection({
  isAnyMutationPending,
  onDeleteClick,
}: FlagDeleteSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-stone-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 text-lg">Delete Flag</h2>
          <p className="mt-1 text-gray-500 text-xs">
            Once you delete a flag, there is no going back. Please be certain.
          </p>
        </div>
        <Button
          className="rounded-lg bg-red-100 px-4 py-2 text-red-700 text-sm hover:bg-red-200"
          disabled={isAnyMutationPending}
          onClick={onDeleteClick}
          variant="ghost"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
