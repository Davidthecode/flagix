import { toast } from "@flagix/ui/components/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import type {
  ProjectDetail,
  ProjectMemberDetail,
  ProjectRole,
  ProjectSettingsResponse,
} from "@/types/project";

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

export const useInviteMember = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    ProjectMemberDetail,
    AxiosError<{ error: string }>,
    { email: string; role: ProjectRole }
  >({
    mutationFn: async (data) => {
      const res = await api.post<ProjectMemberDetail>(
        `/api/projects/${projectId}/members/invite`,
        data
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Invitation sent to ${variables.email} successfully!`);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT_SETTINGS(projectId),
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        "Failed to send invitation. Please try again.";
      toast.error(message);
    },
  });
};

export const useUpdateMemberRole = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    ProjectMemberDetail,
    AxiosError<{ error: string }>,
    { memberId: string; newRole: ProjectRole }
  >({
    mutationFn: async ({ memberId, newRole }) => {
      const res = await api.put<ProjectMemberDetail>(
        `/api/projects/${projectId}/members/${memberId}/role`,
        { role: newRole }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Role updated to ${data.role.toLowerCase()} successfully!`);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT_SETTINGS(projectId),
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        "Failed to update member role. Please try again.";
      toast.error(message);
    },
  });
};

export const useRemoveMember = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; email: string },
    AxiosError<{ error: string }>,
    string
  >({
    mutationFn: async (memberId: string) => {
      const res = await api.delete<{ success: boolean; email: string }>(
        `/api/projects/${projectId}/members/${memberId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Active member ${data.email} removed.`);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT_SETTINGS(projectId),
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        "Failed to remove member. Please try again.";
      toast.error(message);
    },
  });
};

export const useCancelInvite = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; email: string },
    AxiosError<{ error: string }>,
    string
  >({
    mutationFn: async (inviteId: string) => {
      const res = await api.delete<{ success: boolean; email: string }>(
        `/api/projects/${projectId}/invites/${inviteId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Invitation for ${data.email} canceled.`);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT_SETTINGS(projectId),
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        "Failed to cancel invitation. Please try again.";
      toast.error(message);
    },
  });
};

export const useResendInvite = (projectId: string) =>
  useMutation<
    { success: boolean; email: string },
    AxiosError<{ error: string }>,
    string
  >({
    mutationFn: async (inviteId: string) => {
      const res = await api.post<{ success: boolean; email: string }>(
        `/api/projects/${projectId}/invites/${inviteId}/resend`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Invitation link resent to ${data.email}.`);
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        "Failed to resend invitation. Please try again.";
      toast.error(message);
    },
  });

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ProjectMemberDetail,
    AxiosError<{ error: string }>,
    { token: string }
  >({
    mutationFn: async ({ token }) => {
      const res = await api.post<ProjectMemberDetail>(
        "/api/projects/invites/accept",
        { token }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        `Welcome! You successfully joined project ${data.project.name}.`
      );

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT(data.project.id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT_SETTINGS(data.project.id),
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        "Failed to accept invitation. The link may be invalid or expired.";
      toast.error(message);
    },
  });
};
