import { formatDistanceToNowStrict } from "date-fns";
import type React from "react";
import type { AuditLogEntry } from "@/lib/queries/audit-logs";
import { LogListLoader, PaginationControls } from "@/utils/audit-log";

interface AuditLogListProps {
  auditLogs: AuditLogEntry[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoadingLogs: boolean;
  isFetchingLogs: boolean;
  isErrorLogs: boolean;
  onPageChange: (page: number) => void;
}

export const AuditLogList: React.FC<AuditLogListProps> = ({
  auditLogs,
  totalCount,
  totalPages,
  currentPage,
  isLoadingLogs,
  isFetchingLogs,
  isErrorLogs,
  onPageChange,
}) => {
  if (isErrorLogs) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
        <h2 className="font-semibold text-xl">Failed to Load Audit Logs</h2>
        <p>We couldn't retrieve the activity log for this project.</p>
      </div>
    );
  }

  if (isLoadingLogs || isFetchingLogs) {
    return <LogListLoader />;
  }

  if (auditLogs.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        No audit activity found for the selected environment.
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-100">
        {auditLogs.map((log) => (
          <div
            className="-mx-6 flex items-start justify-between px-6 py-4 transition-colors hover:bg-[#F4F4F5]"
            key={log.id}
          >
            <div className="flex flex-col pr-4">
              <p className="font-medium text-gray-800 text-sm">
                <span className="mr-1 font-semibold capitalize">
                  {log.user}
                </span>
                {log.description}
              </p>
              <p className="mt-1 text-gray-500 text-xs">
                {log.createdAt
                  ? formatDistanceToNowStrict(new Date(log.createdAt), {
                      addSuffix: true,
                    })
                  : "Unknown time"}
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3">
              {log.environmentName ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700 text-xs capitalize">
                  {log.environmentName}
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700 text-xs">
                  Project Scope
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalCount > 0 && (
        <PaginationControls
          currentPage={currentPage}
          isFetching={isFetchingLogs}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      )}
    </>
  );
};
