import {
  keepPreviousData,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queries/keys";
import type { TimeRange } from "@/types/analytics";

export type DailyUsage = { date: string; impressions: number };

export type FlagVariationDistribution = {
  flagKey: string;
  [variationName: string]: string | number;
  total: number;
};

export type FlagUsageData = {
  dailyImpressions: DailyUsage[];
  flagDistribution: FlagVariationDistribution[];
  dailyVariationUsageProjectWide: Array<{ [key: string]: number | string }>;
  dailyTopFlagImpressions: Array<{ [key: string]: number | string }>;
};

export type VariationMetrics = {
  name: string;
  conversions: number;
  participants: number;
  conversionRate: number;
  lift: number;
  significance: number;
  status: "winning" | "losing" | "tie";
};

export type EnvironmentResult = {
  environmentName: string;
  environmentId: string;
  variations: VariationMetrics[];
};

export type ABTestResult = {
  experimentName: string;
  flagKey: string;
  metric: string;
  controlVariation: string;
  dailyTrend: Array<{
    date: string;
    variation_name: string;
    conversion_rate: number;
  }>;
  environmentResults: EnvironmentResult[];
};

export const useFlagUsageMetrics = (
  projectId: string,
  timeRange: TimeRange
): UseQueryResult<FlagUsageData> => {
  const fetcher = async (): Promise<FlagUsageData> => {
    const url = `/api/projects/${projectId}/analytics/usage?timeRange=${timeRange}`;
    const response = await api.get(url);
    return response.data;
  };

  return useQuery<FlagUsageData>({
    queryKey: QUERY_KEYS.ANALYTICS_USAGE(projectId, timeRange),
    queryFn: fetcher,
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  });
};

export const useABTestMetrics = (
  projectId: string,
  timeRange: TimeRange
): UseQueryResult<ABTestResult[]> => {
  const fetcher = async (): Promise<ABTestResult[]> => {
    const url = `/api/projects/${projectId}/analytics/ab-tests?timeRange=${timeRange}`;
    const response = await api.get(url);
    return response.data;
  };

  return useQuery<ABTestResult[]>({
    queryKey: QUERY_KEYS.ANALYTICS_AB_TESTS(projectId, timeRange),
    queryFn: fetcher,
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  });
};
