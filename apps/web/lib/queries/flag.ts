import { toast } from "@flagix/ui/components/sonner";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import type {
  EnvironmentConfig,
  FlagConfig,
  FlagType,
  FlagVariation,
  TargetingRule,
} from "@/types/flag";

const updateCacheWithNewEnvConfig = (
  oldFlagConfig: FlagConfig,
  environmentName: string,
  newEnvConfig: EnvironmentConfig
): FlagConfig => ({
  ...oldFlagConfig,
  environments: {
    ...oldFlagConfig.environments,
    [environmentName]: newEnvConfig,
  },
});

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
    placeholderData: keepPreviousData,
  });

/**
 * Updates the flag's global metadata (description).
 */
export const useEditFlagMetadataMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      flagId: string;
      projectId: string;
      newDescription: string;
    }) =>
      api
        .put(`/api/flags/${payload.flagId}/metadata`, payload)
        .then((res) => res.data),

    onMutate: async (variables) => {
      const { flagId, newDescription } = variables;

      const listKey = QUERY_KEYS.FLAGS(projectId);

      // Because description is global, we need to find all environment-specific configs
      // for this flag that are currently in the cache.
      const configCacheQueries = queryClient.getQueryCache().findAll({
        queryKey: [QUERY_KEYS.FLAG_CONFIG_BASE[0], projectId, flagId],
      });

      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        ...configCacheQueries.map((query) =>
          queryClient.cancelQueries({ queryKey: query.queryKey })
        ),
      ]);

      const previousListData = queryClient.getQueryData(listKey);
      const previousConfigs = configCacheQueries.map((query) => ({
        key: query.queryKey,
        data: query.state.data,
      }));

      queryClient.setQueryData<FlagType[]>(listKey, (old) => {
        if (!old) {
          return old;
        }
        return old.map((f) =>
          f.id === flagId ? { ...f, description: newDescription } : f
        );
      });

      for (const query of configCacheQueries) {
        queryClient.setQueryData<FlagConfig | undefined>(
          query.queryKey,
          (old) => {
            if (!old) {
              return old;
            }
            return { ...old, description: newDescription };
          }
        );
      }

      return { previousListData, previousConfigs, listKey };
    },

    onError: (_err, _variables, context) => {
      toast.error("Failed to save flag metadata.");
      if (context?.listKey) {
        queryClient.setQueryData(context.listKey, context.previousListData);
      }
      if (context?.previousConfigs) {
        for (const config of context.previousConfigs) {
          queryClient.setQueryData(config.key, config.data);
        }
      }
    },

    onSuccess: () => {
      toast.success("Flag metadata updated");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FLAG_CONFIG_BASE[0], projectId],
      });
    },
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
      toast.error(`Failed to toggle flag in ${context?.environmentName}.`);
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

    onSuccess: (newRule: TargetingRule, variables) => {
      toast.success("New rule added successfully!");

      queryClient.setQueryData(
        QUERY_KEYS.FLAG_CONFIG(projectId, flagId, variables.environmentName),
        (oldFlagConfig) => {
          const flagConfig = oldFlagConfig as FlagConfig | undefined;

          if (!flagConfig) {
            return oldFlagConfig;
          }

          const envConfig = flagConfig.environments[variables.environmentName];
          if (!envConfig) {
            return oldFlagConfig;
          }

          const updatedEnvConfig = {
            ...envConfig,
            targetingRules: [newRule, ...envConfig.targetingRules],
          };

          return {
            ...flagConfig,
            environments: {
              ...flagConfig.environments,
              [variables.environmentName]: updatedEnvConfig,
            },
          };
        }
      );
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
    onSuccess: (updatedRule, variables) => {
      toast.success("Rule updated successfully!");
      queryClient.setQueryData(
        QUERY_KEYS.FLAG_CONFIG(projectId, flagId, variables.environmentName),
        (oldData) => {
          const oldFlagConfig = oldData as FlagConfig | undefined;
          if (!oldFlagConfig) {
            return;
          }

          const envConfig =
            oldFlagConfig.environments[variables.environmentName];
          if (!envConfig) {
            return oldFlagConfig;
          }

          const updatedRules: TargetingRule[] = envConfig.targetingRules.map(
            (rule) => (rule.id === updatedRule.id ? updatedRule : rule)
          );

          const updatedEnvConfig: EnvironmentConfig = {
            ...envConfig,
            targetingRules: updatedRules,
          };

          return updateCacheWithNewEnvConfig(
            oldFlagConfig,
            variables.environmentName,
            updatedEnvConfig
          );
        }
      );
    },
    onError: () => toast.error("Failed to save rule changes."),
  });
};

/**
 * Reorders a flag rule.
 */
export const useReorderRulesMutation = (
  projectId: string,
  flagId: string,
  environmentName: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { ruleIdsInNewOrder: string[] }) =>
      api.put(`/api/flags/${flagId}/rules/reorder`, {
        projectId,
        environmentName,
        ruleIdsInNewOrder: payload.ruleIdsInNewOrder,
      }),

    onMutate: async (newOrderPayload) => {
      // cancel any current refetches to prevent overwriting
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.FLAG_CONFIG(projectId, flagId, environmentName),
      });

      const previousConfig = queryClient.getQueryData<FlagConfig>(
        QUERY_KEYS.FLAG_CONFIG(projectId, flagId, environmentName)
      );

      if (previousConfig) {
        const rulesMap = new Map(
          previousConfig.environments[environmentName].targetingRules.map(
            (r) => [r.id, r]
          )
        );

        const reorderedRules = newOrderPayload.ruleIdsInNewOrder
          .map((id) => rulesMap.get(id))
          .filter((rule): rule is TargetingRule => !!rule);

        queryClient.setQueryData(
          QUERY_KEYS.FLAG_CONFIG(projectId, flagId, environmentName),
          (oldConfig) => {
            const config = oldConfig as FlagConfig;
            return {
              ...config,
              environments: {
                ...config.environments,
                [environmentName]: {
                  ...config.environments[environmentName],
                  targetingRules: reorderedRules,
                },
              },
            };
          }
        );
      }

      return { previousConfig };
    },

    onError: (_err, _newOrderPayload, context) => {
      toast.error("Failed to save rule order. Rolling back.");
      if (context?.previousConfig) {
        queryClient.setQueryData(
          QUERY_KEYS.FLAG_CONFIG(projectId, flagId, environmentName),
          context.previousConfig
        );
      }
    },

    onSuccess: () => {
      toast.success("Rule order saved.");
    },
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

    onSuccess: (_data, variables) => {
      toast.success("Rule deleted successfully.");
      queryClient.setQueryData(
        QUERY_KEYS.FLAG_CONFIG(projectId, flagId, variables.environmentName),
        (oldData) => {
          const oldFlagConfig = oldData as FlagConfig | undefined;
          if (!oldFlagConfig) {
            return;
          }

          const envConfig =
            oldFlagConfig.environments[variables.environmentName];
          if (!envConfig) {
            return oldFlagConfig;
          }

          // Filter out the deleted rule
          const updatedRules: TargetingRule[] = envConfig.targetingRules.filter(
            (rule) => rule.id !== variables.ruleId
          );

          const updatedEnvConfig: EnvironmentConfig = {
            ...envConfig,
            targetingRules: updatedRules,
          };

          return updateCacheWithNewEnvConfig(
            oldFlagConfig,
            variables.environmentName,
            updatedEnvConfig
          );
        }
      );
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
