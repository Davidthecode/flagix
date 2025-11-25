"use client";

import { toast } from "@flagix/ui/components/sonner";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DeleteFlagModal } from "@/components/flags/delete-flag-modal";
import { EditFlagMetadataModal } from "@/components/flags/edit-flag-metadata-modal";
import { FlagVariationManagementModal } from "@/components/flags/flag-variation-modal";
import { FlagConfigSection } from "@/components/flags/main/flag-config-section";
import { FlagDefaultVariationSection } from "@/components/flags/main/flag-default-variation-section";
import { FlagDeleteSection } from "@/components/flags/main/flag-delete-section";
import { FlagMetadataSection } from "@/components/flags/main/flag-metadata-section";
import { FlagVariationsSection } from "@/components/flags/main/flag-variations-section";
import { TargetingRuleModal } from "@/components/flags/rule/targeting-rule-modal";
import PageLoader from "@/components/shared/page-loader";
import {
  useAddRuleMutation,
  useDeleteFlagMutation,
  useDeleteRuleMutation,
  useEditFlagMetadataMutation,
  useEditRuleMutation,
  useFlagConfig,
  useToggleFlagMutation,
  useUpdateDefaultVariationMutation,
  useUpdateVariationsMutation,
} from "@/lib/queries/flag";
import { useCurrentEnvironment } from "@/providers/environment";
import { useFlag } from "@/providers/flag";
import { useProject } from "@/providers/project";
import type { FlagVariation, StatusSummary, TargetingRule } from "@/types/flag";

function PageClient() {
  const { projectId } = useProject();
  const { flagId } = useFlag();
  const router = useRouter();
  const { currentEnvironment, allEnvironments } = useCurrentEnvironment();

  // This is the project/workspace active environment, the actual Writable Environment
  const USER_WORKSPACE_ENV = currentEnvironment.name;

  // This tracks the environment currently displayed in the CONFIG section dropdown.
  const [viewingEnvironmentName, setViewingEnvironmentName] = useState<
    string | null
  >(null);

  // This derives the environment name used for the API call and display.
  const displayEnvironmentName =
    viewingEnvironmentName || currentEnvironment?.name;

  const isEditable = displayEnvironmentName === USER_WORKSPACE_ENV;

  const [editingRule, setEditingRule] = useState<TargetingRule | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditDetailsModalOpen, setIsEditDetailsModalOpen] = useState(false);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);

  useEffect(() => {
    if (currentEnvironment?.name && !viewingEnvironmentName) {
      setViewingEnvironmentName(currentEnvironment.name);
    }
  }, [currentEnvironment, viewingEnvironmentName]);

  const {
    data: flag,
    isLoading,
    isError,
  } = useFlagConfig(projectId, flagId, displayEnvironmentName);

  const displayEnvironmentConfig = flag?.environments?.[
    displayEnvironmentName
  ] ?? {
    isEnabled: false,
    targetingRules: [],
    defaultVariationName: "off",
  };

  const editMetadataMutation = useEditFlagMetadataMutation(projectId);

  const updateVariationsMutation = useUpdateVariationsMutation(
    projectId,
    flagId,
    displayEnvironmentName
  );

  const updateDefaultVariationMutation = useUpdateDefaultVariationMutation(
    projectId,
    flagId
  );

  const toggleFlagMutation = useToggleFlagMutation(projectId, flagId);
  const addRuleMutation = useAddRuleMutation(projectId, flagId);
  const editRuleMutation = useEditRuleMutation(projectId, flagId);
  const deleteRuleMutation = useDeleteRuleMutation(projectId, flagId);
  const deleteFlagMutation = useDeleteFlagMutation(projectId);

  const isAnyMutationPending =
    updateVariationsMutation.isPending ||
    toggleFlagMutation.isPending ||
    addRuleMutation.isPending ||
    editRuleMutation.isPending ||
    deleteRuleMutation.isPending ||
    deleteFlagMutation.isPending ||
    editMetadataMutation.isPending;

  const otherEnvStatuses: StatusSummary[] = allEnvironments
    .filter((env) => env.name !== displayEnvironmentName)
    .map((env) => ({
      envName: env.name,
      isEnabled: flag?.environments?.[env.name]?.isEnabled ?? false,
    }));

  const handleUpdateDetails = useCallback(
    ({ newKey, newDescription }) => {
      if (editMetadataMutation.isPending) {
        return;
      }

      editMetadataMutation.mutate({
        flagId,
        projectId,
        newKey,
        newDescription,
      });
    },
    [flagId, projectId, editMetadataMutation]
  );

  const handleVariationsUpdate = (newVariations: FlagVariation[]) => {
    updateVariationsMutation.mutate({
      variations: newVariations,
    });
  };

  const handleSetDefaultVariation = useCallback(
    (newDefaultName: string) => {
      if (!isEditable || updateDefaultVariationMutation.isPending) {
        return;
      }

      updateDefaultVariationMutation.mutate({
        environmentName: displayEnvironmentName,

        defaultVariationName: newDefaultName,
      });
    },
    [
      isEditable,
      displayEnvironmentName,

      updateDefaultVariationMutation,
    ]
  );

  const handleToggleFlag = useCallback(() => {
    if (!isEditable || isAnyMutationPending) {
      return;
    }

    const newEnabledState = !displayEnvironmentConfig.isEnabled;

    toggleFlagMutation.mutate({
      environmentName: displayEnvironmentName,
      isEnabled: newEnabledState,
    });
  }, [
    displayEnvironmentName,
    isEditable,
    displayEnvironmentConfig.isEnabled,
    isAnyMutationPending,
    toggleFlagMutation,
  ]);

  const handleAddRule = (newRuleData: TargetingRule) => {
    if (addRuleMutation.isPending) {
      return;
    }

    addRuleMutation.mutate({
      environmentName: displayEnvironmentName,

      rule: newRuleData,
    });
  };

  const handleEditRuleClick = (rule: TargetingRule) => {
    setEditingRule(rule);
  };

  const handleUpdateRule = useCallback(
    (updatedRule: TargetingRule) => {
      if (!updatedRule.id) {
        toast.error("Error: Rule ID missing for update.");
        return;
      }
      if (editRuleMutation.isPending) {
        return;
      }

      editRuleMutation.mutate({
        ruleId: updatedRule.id,
        environmentName: displayEnvironmentName,

        rule: updatedRule,
      });
    },
    [displayEnvironmentName, editRuleMutation]
  );

  const handleDeleteRule = useCallback(
    (ruleId: string, onSuccess?: () => void) => {
      if (deleteRuleMutation.isPending) {
        return;
      }

      deleteRuleMutation.mutate(
        {
          environmentName: displayEnvironmentName,
          ruleId,
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    },
    [displayEnvironmentName, deleteRuleMutation]
  );

  const handleDeleteFlag = useCallback(() => {
    if (deleteFlagMutation.isPending) {
      return;
    }

    deleteFlagMutation.mutate(flagId, {
      onSuccess: () => {
        router.push(`/projects/${projectId}/flags`);
      },
    });
  }, [flagId, deleteFlagMutation, projectId, router]);

  if (isLoading || !flag) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="py-8 text-red-500">
        Failed to load flag configuration.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="flex flex-col gap-y-5">
        <FlagMetadataSection
          createdAt={flag.createdAt}
          description={flag.description}
          flagKey={flag.key}
          isAnyMutationPending={isAnyMutationPending}
          onEditClick={() => setIsEditDetailsModalOpen(true)}
        />

        <FlagVariationsSection
          isAnyMutationPending={isAnyMutationPending}
          onManageClick={() => setIsVariationModalOpen(true)}
          variations={flag.variations}
        />

        <FlagConfigSection
          allEnvironments={allEnvironments}
          displayEnvironmentName={displayEnvironmentName}
          handleDeleteRule={handleDeleteRule}
          handleEditRuleClick={handleEditRuleClick}
          handleToggleFlag={handleToggleFlag}
          isAnyMutationPending={isAnyMutationPending}
          isDeletingRule={deleteRuleMutation.isPending}
          isEditable={isEditable}
          isEnabled={displayEnvironmentConfig.isEnabled}
          onAddRuleClick={() => setIsAddRuleModalOpen(true)}
          otherEnvStatuses={otherEnvStatuses}
          setViewingEnvironmentName={setViewingEnvironmentName}
          targetingRules={displayEnvironmentConfig.targetingRules}
        />

        <FlagDefaultVariationSection
          defaultVariationName={displayEnvironmentConfig.defaultVariationName}
          isAnyMutationPending={isAnyMutationPending}
          isEditable={isEditable}
          onSetDefaultVariation={handleSetDefaultVariation}
          variations={flag.variations}
        />

        <FlagDeleteSection
          isAnyMutationPending={isAnyMutationPending}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
        />
      </div>

      <FlagVariationManagementModal
        isOpen={isVariationModalOpen}
        isSubmitting={updateVariationsMutation.isPending}
        onClose={() => setIsVariationModalOpen(false)}
        onSave={handleVariationsUpdate}
        variations={flag.variations}
      />

      <TargetingRuleModal
        availableVariations={flag.variations}
        isOpen={isAddRuleModalOpen || !!editingRule}
        isSubmitting={addRuleMutation.isPending || editRuleMutation.isPending}
        onClose={() => {
          setIsAddRuleModalOpen(false);
          setEditingRule(null);
        }}
        onSave={(savedRule) => {
          if (editingRule) {
            handleUpdateRule({
              ...savedRule,
              id: editingRule.id,
            } as TargetingRule);
          } else {
            handleAddRule(savedRule);
          }
        }}
        rule={editingRule ?? null}
      />

      <EditFlagMetadataModal
        initialDescription={flag.description}
        initialKey={flag.key}
        isOpen={isEditDetailsModalOpen}
        isSubmitting={isAnyMutationPending}
        onClose={() => setIsEditDetailsModalOpen(false)}
        onSave={handleUpdateDetails}
      />

      <DeleteFlagModal
        flagKey={flag.key}
        isOpen={isDeleteModalOpen}
        isSubmitting={deleteFlagMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleDeleteFlag}
      />
    </div>
  );
}

export default PageClient;
