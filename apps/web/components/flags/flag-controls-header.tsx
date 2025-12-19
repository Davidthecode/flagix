import { Button } from "@flagix/ui/components/button";
import { Input } from "@flagix/ui/components/input";
import { Plus, Search } from "lucide-react";
import type React from "react";

interface FlagControlsHeaderProps {
  flagCountDisplay: string;
  onOpenCreateModal: () => void;
  onSearchTermChange: (term: string) => void;
  searchTerm: string;
  isControlsDisabled: boolean;
}

export const FlagControlsHeader: React.FC<FlagControlsHeaderProps> = ({
  flagCountDisplay,
  onOpenCreateModal,
  onSearchTermChange,
  searchTerm,
  isControlsDisabled,
}) => (
  <>
    <div className="mb-8 flex items-center justify-between">
      <h2 className="font-semibold text-xl">Flags Management</h2>
      <Button
        className="flex bg-emerald-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-emerald-70"
        disabled={isControlsDisabled}
        onClick={onOpenCreateModal}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Flag
      </Button>
    </div>

    <div className="mb-6 flex items-center gap-4">
      <div className="relative w-80">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          className="h-10 w-full rounded-lg border-gray-200 bg-white pr-4 pl-10 text-sm transition-shadow placeholder:text-gray-400"
          disabled={isControlsDisabled}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder="Search flags..."
          type="search"
          value={searchTerm}
        />
      </div>
      <span className="text-gray-500 text-sm">{flagCountDisplay}</span>
    </div>
  </>
);
