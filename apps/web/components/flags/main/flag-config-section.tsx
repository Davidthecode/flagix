import { Button } from "@flagix/ui/components/button";
import { Toggle } from "@flagix/ui/components/toggle";
import { Lock } from "lucide-react";
import { SortableRuleList } from "@/components/flags/main/sortable-rule-list";
import type { BaseEnvironment } from "@/types/environment";
import type { StatusSummary, TargetingRule } from "@/types/flag";

type FlagConfigSectionProps = {
  allEnvironments: BaseEnvironment[];
  displayEnvironmentName: string;
  setViewingEnvironmentName: (name: string) => void;
  isEditable: boolean;
  isEnabled: boolean;
  handleToggleFlag: () => void;
  isAnyMutationPending: boolean;
  targetingRules: TargetingRule[];
  handleRuleOrderUpdate: (reorderedRules: TargetingRule[]) => void;
  otherEnvStatuses: StatusSummary[];
  handleDeleteRule: (ruleId: string, onSuccess?: () => void) => void;
  handleEditRuleClick: (rule: TargetingRule) => void;
  onAddRuleClick: () => void;
  isDeletingRule: boolean;
};

export function FlagConfigSection({
  allEnvironments,
  displayEnvironmentName,
  setViewingEnvironmentName,
  isEditable,
  isEnabled,
  handleToggleFlag,
  isAnyMutationPending,
  targetingRules,
  handleRuleOrderUpdate,
  otherEnvStatuses,
  handleDeleteRule,
  handleEditRuleClick,
  onAddRuleClick,
  isDeletingRule,
}: FlagConfigSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-stone-100">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-lg">Configuration</h2>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">Viewing Environment:</span>
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-sm capitalize"
            onChange={(e) => setViewingEnvironmentName(e.target.value)}
            value={displayEnvironmentName}
          >
            {allEnvironments.map((environment) => (
              <option key={environment.name} value={environment.name}>
                {environment.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 font-semibold text-sm">
              Master Toggle for Active Workspace
            </div>
            <div className="mt-2">
              {displayEnvironmentName} is{" "}
              <span className="rounded-md bg-[#F2F2F2] px-2 py-1">
                {isEnabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>
          </div>

          {isEditable ? (
            <Toggle
              checked={isEnabled}
              disabled={isAnyMutationPending}
              onChange={handleToggleFlag}
            />
          ) : (
            <span className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="italic">Read-Only</span>
              <Lock className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        {otherEnvStatuses.length > 0 && (
          <div className="rounded-lg border border-gray-100 bg-[#F2F2F2] p-4">
            <h4 className="mb-2 font-medium text-gray-700 text-sm">
              Other Environment Status
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {otherEnvStatuses.map((status) => (
                <div className="flex items-center" key={status.envName}>
                  <span className="font-semibold text-gray-800 capitalize">
                    {status.envName}:
                  </span>
                  <span
                    className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
                      status.isEnabled
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {status.isEnabled ? "ON" : "OFF"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-base text-gray-900">
            Targeting Rules
          </h3>
          <Button
            className="bg-emerald-600 p-2 text-white text-xs hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-600"
            disabled={!isEditable || isAnyMutationPending}
            onClick={onAddRuleClick}
          >
            Add Rule
          </Button>
        </div>

        <div className="space-y-3">
          <SortableRuleList
            isDeletingRule={isDeletingRule}
            isEditable={isEditable}
            onDelete={handleDeleteRule}
            onEdit={handleEditRuleClick}
            onRuleOrderChange={handleRuleOrderUpdate}
            rules={targetingRules}
          />
        </div>

        <p className="mt-4 border-gray-200 border-t pt-4 text-gray-500 text-sm">
          Rules are evaluated in order. The last rule acts as the default
          fallback.
        </p>
      </div>
    </div>
  );
}
