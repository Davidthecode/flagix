"use client";

import { Button } from "@flagix/ui/components/button";
import { Spinner } from "@flagix/ui/components/spinner";
import { Plus } from "lucide-react";
import type { FullEnvironment } from "@/types/environment";
import { TruncatedTabName } from "@/utils/environment";

type EnvironmentTabsProps = {
  environments: FullEnvironment[];
  selectedEnvId: string | null;
  setSelectedEnvId: (id: string | null) => void;
  isFetching: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement | null>;
};

export function EnvironmentTabs({
  environments,
  selectedEnvId,
  setSelectedEnvId,
  isFetching,
  isLoading,
  isSubmitting,
  setIsCreateModalOpen,
  tabsContainerRef,
}: EnvironmentTabsProps) {
  return (
    <div className="flex items-center justify-between border-gray-200 border-b">
      <div
        className="scrollbar-hide flex space-x-6 overflow-x-auto whitespace-nowrap"
        ref={tabsContainerRef}
      >
        {environments.map((env: FullEnvironment) => (
          <Button
            className={`relative px-0 py-3 font-medium text-sm capitalize transition-colors ${
              selectedEnvId === env.id
                ? "text-emerald-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            data-env-id={env.id}
            key={env.id}
            onClick={() => {
              setSelectedEnvId(env.id);
            }}
          >
            <TruncatedTabName maxLength={15} name={env.name} />
            {selectedEnvId === env.id && (
              <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-emerald-600" />
            )}
          </Button>
        ))}
        {isFetching && !isLoading && (
          <span className="p-3">
            <Spinner className="text-emerald-500" size={16} />
          </span>
        )}
      </div>
      <Button
        className="ml-4 shrink-0 bg-emerald-600 p-2 text-sm text-white hover:bg-emerald-700"
        disabled={isSubmitting}
        onClick={() => setIsCreateModalOpen(true)}
      >
        <Plus className="mr-1 h-3.5 w-3.5" />
        New
      </Button>
    </div>
  );
}
