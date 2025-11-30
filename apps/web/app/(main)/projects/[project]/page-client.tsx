"use client";

import { MetricCard } from "@flagix/ui/components/metric-card";
import { Spinner } from "@flagix/ui/components/spinner";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { IntegrationStatus } from "@/components/project/integration-status";
import { RecentActivity } from "@/components/project/recent-activity";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import { useProject } from "@/providers/project";
import type { DashboardData } from "@/types/dashboard";

export default function ProjectDashboardPage() {
  const { projectId } = useProject();

  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: QUERY_KEYS.PROJECT_DASHBOARD(projectId),
    queryFn: () =>
      api.get(`/api/projects/${projectId}/dashboard`).then((res) => res.data),
    enabled: !!projectId,
  });

  const METRICS_MAP: {
    [key in keyof typeof data.metrics]: {
      title: string;
      description: string;
      action: string;
      href: string;
    };
  } = {
    totalFlags: {
      title: "Total Flags",
      description: "Active feature flags across all environments.",
      action: "View Flags",
      href: `/projects/${projectId}/flags`,
    },
    environmentsCount: {
      title: "Environments",
      description: "Available environments (e.g., Prod, Stage, Dev).",
      action: "Manage Environments",
      href: `/projects/${projectId}/environments`,
    },
    targetingRules: {
      title: "Targeting Rules",
      description: "Conditions for gradual rollouts and A/B tests.",
      action: "View Rules",
      href: `/projects/${projectId}/analytics`,
    },
    evaluations: {
      title: "Evaluations",
      description: "SDK Evaluations (currently unavailable).",
      action: "View Analytics",
      href: `/projects/${projectId}/analytics`,
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-16">
        <Spinner className="text-emerald-600" size={40} />
        <p className="mt-4 text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-red-600">
        <h2 className="mb-2 font-semibold text-xl">Failed to Load Dashboard</h2>
        <p className="text-gray-600">
          We couldn't retrieve the project metrics. Please check your connection
          or try again.
        </p>
      </div>
    );
  }

  const dashboardMetrics = (
    Object.keys(data.metrics) as Array<keyof typeof data.metrics>
  ).map((key) => {
    const meta = METRICS_MAP[key];
    return {
      title: meta.title,
      value: data.metrics[key].toString(),
      description: meta.description,
      actionLink: {
        label: meta.action,
        href: meta.href,
      },
    };
  });

  return (
    <div>
      <div className="mt-8">
        <h2 className="mb-4 font-semibold text-lg">Overview Metrics</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} linkComponent={Link} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-semibold text-lg">Quick Actions & Status</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <IntegrationStatus environments={data.environments} />
          <RecentActivity logs={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}
