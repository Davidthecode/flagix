"use client";

import { toast } from "@flagix/ui/components/sonner";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DeleteFlagModal } from "@/components/flags/delete-flag-modal";
import { EditFlagMetadataModal } from "@/components/flags/edit-flag-metadata-modal";
import { FlagEnvironmentConfig } from "@/components/flags/flag-environment-config";
import { FlagVariationManagementModal } from "@/components/flags/flag-variation-modal";
import { FlagDeleteSection } from "@/components/flags/main/flag-delete-section";
import { FlagMetadataSection } from "@/components/flags/main/flag-metadata-section";
import { FlagVariationsSection } from "@/components/flags/main/flag-variations-section";
import { TargetingRuleModal } from "@/components/flags/rule/targeting-rule-modal";
import { FlagPageSkeleton } from "@/components/flags/skeleton";
import {
  useAddRuleMutation,
  useDeleteFlagMutation,
  useDeleteRuleMutation,
  useEditFlagMetadataMutation,
  useEditRuleMutation,
  useFlagConfig,
  useReorderRulesMutation,
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
    if (currentEnvironment?.name) {
      setViewingEnvironmentName(currentEnvironment.name);
    }
  }, [currentEnvironment?.name]);

  const {
    data: flag,
    isLoading,
    isFetching,
    isPlaceholderData,
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
  const reorderRulesMutation = useReorderRulesMutation(
    projectId,
    flagId,
    displayEnvironmentName
  );

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

      editMetadataMutation.mutate(
        {
          flagId,
          projectId,
          newKey,
          newDescription,
        },
        {
          onSuccess: () => {
            setIsEditDetailsModalOpen(false);
          },
          onError: () => {
            toast.error("Error editing flag metadata");
          },
        }
      );
    },
    [flagId, projectId, editMetadataMutation]
  );

  const handleVariationsUpdate = (newVariations: FlagVariation[]) => {
    updateVariationsMutation.mutate(
      {
        variations: newVariations,
      },
      {
        onSuccess: () => {
          setIsVariationModalOpen(false);
        },
      }
    );
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

    addRuleMutation.mutate(
      {
        environmentName: displayEnvironmentName,
        rule: newRuleData,
      },
      {
        onSuccess: () => {
          setIsAddRuleModalOpen(false);
        },
      }
    );
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

      editRuleMutation.mutate(
        {
          ruleId: updatedRule.id,
          environmentName: displayEnvironmentName,
          rule: updatedRule,
        },
        {
          onSuccess: () => {
            setIsAddRuleModalOpen(false);
            setEditingRule(null);
          },
        }
      );
    },
    [displayEnvironmentName, editRuleMutation]
  );

  const handleRuleOrderUpdate = useCallback(
    (newRules: TargetingRule[]) => {
      const ruleIdsInNewOrder = newRules.map((r) => r.id);
      reorderRulesMutation.mutate({ ruleIdsInNewOrder });
    },
    [reorderRulesMutation]
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
        setIsDeleteModalOpen(false);
        router.push(`/projects/${projectId}/flags`);
      },
    });
  }, [flagId, deleteFlagMutation, projectId, router]);

  if (!flag) {
    if (isLoading) {
      return <FlagPageSkeleton />;
    }
    if (isError) {
      return <div className="py-8 text-red-500">Failed to load flag.</div>;
    }
    return null;
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

        <FlagEnvironmentConfig
          allEnvironments={allEnvironments}
          config={displayEnvironmentConfig}
          displayEnvironmentName={displayEnvironmentName}
          handleDeleteRule={handleDeleteRule}
          handleEditRuleClick={handleEditRuleClick}
          handleRuleOrderUpdate={handleRuleOrderUpdate}
          handleSetDefaultVariation={handleSetDefaultVariation}
          handleToggleFlag={handleToggleFlag}
          isAnyMutationPending={isAnyMutationPending}
          isDeletingRule={deleteRuleMutation.isPending}
          isEditable={isEditable}
          isLoading={isFetching && isPlaceholderData}
          onAddRuleClick={() => setIsAddRuleModalOpen(true)}
          otherEnvStatuses={otherEnvStatuses}
          setViewingEnvironmentName={setViewingEnvironmentName}
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
