import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";

export type AuditLogEntry = {
  id: string;
  actionType: string;
  description: string;
  user: string;
  createdAt: string;
  environmentName?: string;
};

type AuditLogResponse = {
  logs: AuditLogEntry[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
};

export const useAuditLogs = (
  projectId: string,
  environmentName: string | null,
  page = 1,
  limit = 20
): UseQueryResult<AuditLogResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("limit", limit.toString());
  queryParams.append("page", page.toString());

  if (environmentName && environmentName !== "All Environments") {
    queryParams.append("environmentName", environmentName);
  }

  const fetcher = async (): Promise<AuditLogResponse> => {
    const url = `/api/projects/${projectId}/audit-logs?${queryParams.toString()}`;
    const response = await api.get(url);
    return response.data;
  };

  return useQuery<AuditLogResponse>({
    queryKey: QUERY_KEYS.AUDIT_LOGS(projectId, environmentName, page),
    queryFn: fetcher,
    enabled: !!projectId,
  });
};
