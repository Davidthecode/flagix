"use client";

import { useMemo, useState } from "react";
import { AuditLogHeader } from "@/components/audit-log/audit-log-header";
import { AuditLogList } from "@/components/audit-log/audit-log-list";
import PageLoader from "@/components/shared/page-loader";
import { useAuditLogs } from "@/lib/queries/audit-logs";
import { useEnvironments } from "@/lib/queries/environments";
import { useProject } from "@/providers/project";

export default function PageClient() {
  const { projectId } = useProject();
  const [selectedEnvironment, setSelectedEnvironment] =
    useState<string>("All Environments");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: environments = [], isLoading: isLoadingEnvs } =
    useEnvironments(projectId);

  const {
    data: logResponse,
    isLoading: isLoadingLogs,
    isFetching: isFetchingLogs,
    isError: isErrorLogs,
  } = useAuditLogs(projectId, selectedEnvironment, currentPage);

  const auditLogs = logResponse?.logs ?? [];
  const totalCount = logResponse?.totalCount ?? 0;
  const totalPages = logResponse?.totalPages ?? 1;

  const handleEnvironmentChange = (envName: string) => {
    setSelectedEnvironment(envName);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filterOptions = useMemo(
    () => [
      { name: "All Environments", isAll: true },
      ...environments.map((env) => ({ name: env.name, isAll: false })),
    ],
    [environments]
  );

  if (isLoadingEnvs) {
    return <PageLoader />;
  }

  return (
    <div className="py-6">
      <div className="flex flex-col space-y-6 rounded-lg border border-gray-200 bg-white px-6 py-6 shadow-sm">
        <AuditLogHeader
          auditLogsLength={auditLogs.length}
          filterOptions={filterOptions}
          isFetchingLogs={isFetchingLogs}
          isLoadingEnvs={isLoadingEnvs}
          onEnvironmentChange={handleEnvironmentChange}
          selectedEnvironment={selectedEnvironment}
          totalCount={totalCount}
        />

        <AuditLogList
          auditLogs={auditLogs}
          currentPage={currentPage}
          isErrorLogs={isErrorLogs}
          isFetchingLogs={isFetchingLogs}
          isLoadingLogs={isLoadingLogs}
          onPageChange={handlePageChange}
          totalCount={totalCount}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
