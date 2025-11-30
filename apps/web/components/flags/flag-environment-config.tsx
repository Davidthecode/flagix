import { Skeleton } from "@flagix/ui/components/skeleton";
import { FlagConfigSection } from "@/components/flags/main/flag-config-section";
import { FlagDefaultVariationSection } from "@/components/flags/main/flag-default-variation-section";
import type { BaseEnvironment } from "@/types/environment";
import type {
  EnvironmentConfig,
  FlagVariation,
  StatusSummary,
  TargetingRule,
} from "@/types/flag";

type FlagEnvironmentConfigProps = {
  variations: FlagVariation[];
  config: EnvironmentConfig;
  allEnvironments: BaseEnvironment[];
  displayEnvironmentName: string;
  otherEnvStatuses: StatusSummary[];
  setViewingEnvironmentName: (name: string) => void;
  handleToggleFlag: () => void;
  handleDeleteRule: (ruleId: string, onSuccess?: () => void) => void;
  handleEditRuleClick: (rule: TargetingRule) => void;
  onAddRuleClick: () => void;
  handleRuleOrderUpdate: (reorderedRules: TargetingRule[]) => void;
  handleSetDefaultVariation: (newDefaultName: string) => void;
  isEditable: boolean;
  isAnyMutationPending: boolean;
  isDeletingRule: boolean;
  isLoading: boolean;
};

const LoadingState = () => (
  <div className="flex flex-col gap-y-5">
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-stone-100">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-100 bg-[#F2F2F2] p-4">
        <Skeleton className="mb-3 h-4 w-40" />
        <div className="flex gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>

        <Skeleton className="mt-4 h-3 w-64" />
      </div>
    </div>

    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
    </div>
  </div>
);

export function FlagEnvironmentConfig({
  variations,
  config,
  allEnvironments,
  displayEnvironmentName,
  otherEnvStatuses,
  setViewingEnvironmentName,
  handleToggleFlag,
  handleDeleteRule,
  handleEditRuleClick,
  onAddRuleClick,
  handleRuleOrderUpdate,
  handleSetDefaultVariation,
  isEditable,
  isAnyMutationPending,
  isDeletingRule,
  isLoading,
}: FlagEnvironmentConfigProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <FlagConfigSection
        allEnvironments={allEnvironments}
        displayEnvironmentName={displayEnvironmentName}
        handleDeleteRule={handleDeleteRule}
        handleEditRuleClick={handleEditRuleClick}
        handleRuleOrderUpdate={handleRuleOrderUpdate}
        handleToggleFlag={handleToggleFlag}
        isAnyMutationPending={isAnyMutationPending}
        isDeletingRule={isDeletingRule}
        isEditable={isEditable}
        isEnabled={config.isEnabled}
        onAddRuleClick={onAddRuleClick}
        otherEnvStatuses={otherEnvStatuses}
        setViewingEnvironmentName={setViewingEnvironmentName}
        targetingRules={config.targetingRules}
      />

      <FlagDefaultVariationSection
        defaultVariationName={config.defaultVariationName}
        isAnyMutationPending={isAnyMutationPending}
        isEditable={isEditable}
        onSetDefaultVariation={handleSetDefaultVariation}
        variations={variations}
      />
    </>
  );
}
