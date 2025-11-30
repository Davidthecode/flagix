import { Clock } from "lucide-react";
import Link from "next/link";
import { useProject } from "@/providers/project";
import type { DashboardData } from "@/types/dashboard";

type RecentActivityProps = {
  logs: DashboardData["recentActivity"];
};

export function RecentActivity({ logs }: RecentActivityProps) {
  const { projectId } = useProject();

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-700 text-lg">
        <Clock className="h-5 w-5" /> Recent Activity
      </h3>
      {logs.length > 0 ? (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li
              className="flex items-start justify-between border-gray-100 border-b pb-3 text-sm last:border-b-0 last:pb-0"
              key={`${log.description} - ${log.time}`}
            >
              <p className="pr-4 text-gray-700">{log.description}</p>
              <span className="whitespace-nowrap font-mono text-gray-500 text-xs">
                {log.time}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 border-dashed bg-[#F4F4F5] p-6 text-center">
          <p className="text-gray-500 text-sm">
            No recent activity recorded for this project yet.
          </p>
          <p className="mt-1 text-gray-400 text-xs">
            Activity logs will appear here once you create flags, environments,
            or make changes.
          </p>
        </div>
      )}
      <div className="mt-4 border-gray-100 border-t pt-3 text-right">
        <Link
          className="font-medium text-emerald-600 text-sm hover:text-emerald-70 hover:underline"
          href={`/projects/${projectId}/audit`}
        >
          View All Audit Logs
        </Link>
      </div>
    </div>
  );
}
