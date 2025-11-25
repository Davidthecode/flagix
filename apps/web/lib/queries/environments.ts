import { toast } from "@flagix/ui/components/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import type { FullEnvironment } from "@/types/environment";

export const useEnvironments = (projectId: string) =>
  useQuery<FullEnvironment[]>({
    queryKey: QUERY_KEYS.ENVIRONMENTS(projectId),
    queryFn: () =>
      api
        .get(`/api/projects/${projectId}/environments`)
        .then((res) => res.data),
    enabled: !!projectId,
  });

export const useCreateEnvironment = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string }) =>
      api
        .post(`/api/projects/${projectId}/environments`, payload)
        .then((res) => res.data),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.ENVIRONMENTS(projectId),
      });

      const previousEnvironments = queryClient.getQueryData<FullEnvironment[]>(
        QUERY_KEYS.ENVIRONMENTS(projectId)
      );

      return { previousEnvironments };
    },

    onSuccess: (newEnv: FullEnvironment) => {
      queryClient.setQueryData<FullEnvironment[]>(
        QUERY_KEYS.ENVIRONMENTS(projectId),
        (old) => (old ? [...old, newEnv] : [newEnv])
      );
      toast.success(`Environment '${newEnv.name}' created.`);
    },

    onError: (_err, _payload, context) => {
      if (context?.previousEnvironments) {
        queryClient.setQueryData(
          QUERY_KEYS.ENVIRONMENTS(projectId),
          context.previousEnvironments
        );
      }
      toast.error("Environment creation failed.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ENVIRONMENTS(projectId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT(projectId),
      });
    },
  });
};

export const useDeleteEnvironment = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (environmentId: string) =>
      api.delete(`/api/projects/${projectId}/environments/${environmentId}`),

    onMutate: async (environmentId: string) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.ENVIRONMENTS(projectId),
      });

      const previousEnvironments = queryClient.getQueryData<FullEnvironment[]>(
        QUERY_KEYS.ENVIRONMENTS(projectId)
      );

      queryClient.setQueryData<FullEnvironment[]>(
        QUERY_KEYS.ENVIRONMENTS(projectId),
        (old) => old?.filter((env) => env.id !== environmentId)
      );

      return { previousEnvironments };
    },

    onError: (_err, _environmentId, context) => {
      if (context?.previousEnvironments) {
        queryClient.setQueryData(
          QUERY_KEYS.ENVIRONMENTS(projectId),
          context.previousEnvironments
        );
      }
      toast.error("Delete failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ENVIRONMENTS(projectId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT(projectId),
      });
    },
  });
};
