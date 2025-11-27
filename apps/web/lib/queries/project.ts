import { toast } from "@flagix/ui/components/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import type { ProjectDetail, ProjectSettingsResponse } from "@/types/project";

export const useProjectSettings = (projectId: string) =>
  useQuery<ProjectSettingsResponse, AxiosError>({
    queryKey: QUERY_KEYS.PROJECT_SETTINGS(projectId),
    queryFn: async () => {
      const res = await api.get<ProjectSettingsResponse>(
        `/api/projects/${projectId}/settings`
      );
      return res.data;
    },
    enabled: !!projectId,
  });

export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    ProjectDetail,
    AxiosError<{
      error: string;
    }>,
    { name: string; description: string }
  >({
    mutationFn: async (data: { name: string; description: string }) => {
      const res = await api.put<ProjectDetail>(
        `/api/projects/${projectId}`,
        data
      );
      console.log("project update res ==>", res);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Project updated successfully!");

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT_SETTINGS(projectId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT(projectId),
      });
    },

    onError: (error) => {
      const message =
        error.response?.data?.error ||
        "Failed to update project. Please try again.";
      toast.error(message);
    },
  });
};

export const useDeleteProject = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await api.delete(`/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
