"use client";

import { Skeleton } from "@flagix/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import type { ProjectMetricsData } from "@/types/project";

const MetricsSkeleton = () => (
  <div className="flex w-full items-start gap-4">
    <Skeleton className="h-20 flex-1 rounded-xl" />
    <Skeleton className="h-20 flex-1 rounded-xl" />
    <Skeleton className="h-20 flex-1 rounded-xl" />
  </div>
);

export const ProjectMetrics = () => {
  const { data, isLoading } = useQuery<ProjectMetricsData>({
    queryKey: QUERY_KEYS.PROJECT_METRICS,
    queryFn: () => api.get("/api/projects/metrics").then((res) => res.data),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const flags = data?.flags ?? 0;
  const environments = data?.environments ?? 0;
  const evaluations = data?.evaluations ?? 0;

  return (
    <div className="border-b py-6">
      <div className="mb-6 flex items-center">
        <span className="font-normal text-gray-500">
          Gradual rollouts, A/B testing, and targeting rules
        </span>
      </div>

      {isLoading ? (
        <MetricsSkeleton />
      ) : (
        <div className="flex w-full items-start gap-4">
          <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-4">
            <div className="font-medium text-gray-500 text-sm uppercase">
              FLAGS
            </div>
            <div className="mt-1 font-semibold text-gray-900 text-medium opacity-90">
              {flags.toLocaleString()}
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-4">
            <div className="font-medium text-gray-500 text-sm uppercase">
              ENVIRONMENTS
            </div>
            <div className="mt-1 font-semibold text-gray-900 text-medium opacity-90">
              {environments.toLocaleString()}
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-4">
            <div className="font-medium text-gray-500 text-sm uppercase">
              EVALUATIONS (last 30D)
            </div>
            <div className="mt-1 font-semibold text-gray-900 text-medium opacity-90">
              {evaluations.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
