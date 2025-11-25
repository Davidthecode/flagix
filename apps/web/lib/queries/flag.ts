import { toast } from "@flagix/ui/components/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import type { FlagConfig, FlagVariation, TargetingRule } from "@/types/flag";

/**
 * Fetches the configuration for a specific flag in a specific environment.
 */
export const useFlagConfig = (
  projectId: string,
  flagId: string,
  environmentName: string
) =>
  useQuery<FlagConfig>({
    queryKey: QUERY_KEYS.FLAG_CONFIG(projectId, flagId, environmentName),
    queryFn: () =>
      api
        .get(`/api/flags/${flagId}?environmentName=${environmentName}`)
        .then((res) => res.data),
    enabled: Boolean(projectId && flagId && environmentName),
  });

/**
 * Updates the flag's global metadata (key and description).
 */
export const useEditFlagMetadataMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      flagId: string;
      projectId: string;
      newKey: string;
      newDescription: string;
    }) =>
      api
        .put(`/api/flags/${payload.flagId}/metadata`, payload)
        .then((res) => res.data),

    onSuccess: () => {
      toast.success("Flag metadata updated");
      queryClient.invalidateQueries({
        // Invalidate all flag configs for the current project
        queryKey: [QUERY_KEYS.FLAG_CONFIG_BASE[0], projectId],
      });
    },
    onError: () => toast.error("Failed to save flag metadata."),
  });
};

/**
 * Updates the flag's global variations.
 */
export const useUpdateVariationsMutation = (
  projectId: string,
  flagId: string,
  environmentName: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { variations: FlagVariation[] }) =>
      api
        .put(`/api/flags/${flagId}/variations`, { ...payload, projectId })
        .then((res) => res.data),
    onSuccess: () => {
      // Variations are global, so we invalidate the current config to refetch the update
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FLAG_CONFIG(projectId, flagId, environmentName),
      });
      toast.success("Flag variations updated globally.");
    },
    onError: () => toast.error("Failed to save variations."),
  });
};

/**
 * Updates the default variation for a specific environment.
 */
export const useUpdateDefaultVariationMutation = (
  projectId: string,
  flagId: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      environmentName: string;
      defaultVariationName: string;
    }) =>
      api
        .put(`/api/flags/${flagId}/default-variation`, {
          ...payload,
          projectId,
        })
        .then((res) => res.data),
    onSuccess: (data, variables) => {
      toast.success(
        `Default variation set to '${data.defaultVariationName}' in ${variables.environmentName}.`
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FLAG_CONFIG(
          projectId,
          flagId,
          variables.environmentName
        ),
      });
    },
    onError: () => toast.error("Failed to update default variation."),
  });
};

/**
 * Toggles the FlagState (enabled/disabled) for a specific environment.
 */
export const useToggleFlagMutation = (projectId: string, flagId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { environmentName: string; isEnabled: boolean }) =>
      api
        .put(`/api/flags/${flagId}/state`, { ...payload, projectId })
        .then((res) => res.data),

    onMutate: async (variables) => {
      const { environmentName, isEnabled } = variables;
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.FLAG_CONFIG(projectId, flagId, environmentName),
      });

      const previousFlag = queryClient.getQueryData<FlagConfig>(
        QUERY_KEYS.FLAG_CONFIG(projectId, flagId, environmentName)
      );

      queryClient.setQueryData<FlagConfig>(
        QUERY_KEYS.FLAG_CONFIG(projectId, flagId, environmentName),
        (old) => {
          if (!old) {
            return old;
          }
          return {
            ...old,
            environments: {
              ...old.environments,
              [environmentName]: {
                ...old.environments[environmentName],
                isEnabled,
              },
            },
          };
        }
      );

      return { previousFlag, environmentName };
    },

    onSuccess: (_data, _variables, context) => {
      const status = _data.isEnabled ? "enabled" : "disabled";
      toast.success(
        `Flag successfully ${status} in ${context.environmentName}.`
      );
    },

    onError: (_err, _variables, context) => {
      if (context?.previousFlag) {
        queryClient.setQueryData(
          QUERY_KEYS.FLAG_CONFIG(projectId, flagId, context.environmentName),
          context.previousFlag
        );
      }
      toast.error(`Failed to toggle flag in ${context.environmentName}.`);
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FLAG_CONFIG(
          projectId,
          flagId,
          variables.environmentName
        ),
      });
    },
  });
};

/**
 * Adds a new targeting rule.
 */
export const useAddRuleMutation = (projectId: string, flagId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { environmentName: string; rule: TargetingRule }) =>
      api
        .post(`/api/flags/${flagId}/rules`, { ...payload, projectId })
        .then((res) => res.data as TargetingRule),

    onSuccess: (_newRule, variables) => {
      toast.success("New rule added successfully!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FLAG_CONFIG(
          projectId,
          flagId,
          variables.environmentName
        ),
      });
    },
    onError: () => toast.error("Failed to add new rule."),
  });
};

/**
 * Edits an existing targeting rule.
 */
export const useEditRuleMutation = (projectId: string, flagId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      ruleId: string;
      environmentName: string;
      rule: TargetingRule;
    }) =>
      api
        .put(`/api/flags/${flagId}/rules/${payload.ruleId}`, {
          ...payload,
          projectId,
        })
        .then((res) => res.data),
    onSuccess: (_data, variables) => {
      toast.success("Rule updated successfully!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FLAG_CONFIG(
          projectId,
          flagId,
          variables.environmentName
        ),
      });
    },
    onError: () => toast.error("Failed to save rule changes."),
  });
};

/**
 * Deletes a targeting rule.
 */
export const useDeleteRuleMutation = (projectId: string, flagId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { ruleId: string; environmentName: string }) =>
      api
        .delete(`/api/flags/${flagId}/rules/${payload.ruleId}`)
        .then((res) => res.data),

    onSuccess: () => {
      toast.success("Rule deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FLAG_CONFIG_BASE[0], projectId, flagId],
      });
    },
    onError: () => toast.error("Failed to delete rule."),
  });
};

/**
 * Deletes the entire flag.
 */
export const useDeleteFlagMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flagIdToDelete: string) =>
      api.delete(`/api/flags/${flagIdToDelete}`).then((res) => res.data),

    onSuccess: (_data, _flagId) => {
      toast.success("Flag deleted.");

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FLAGS(projectId),
      });
    },
    onError: () => toast.error("Failed to delete flag."),
  });
};
