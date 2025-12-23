"use client";

import { AnalyticsCard } from "@flagix/ui/components/analytics-card";
import { MetricCard } from "@flagix/ui/components/metric-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@flagix/ui/components/select";
import { format } from "date-fns";
import { Clock, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TimeRangeSelector } from "@/components/analytics/time-range-selector";
import { CHART_LINE_COLORS } from "@/lib/constants";
import type { FlagUsageData } from "@/lib/queries/analytics";
import type { TimeRange } from "@/types/analytics";
import { pivotAnalyticsData } from "@/utils/analytics";
import { CustomTooltipForFlagUageMetrics } from "@/utils/chart";
import { AnalyticsContentSkeleton } from "./analytics-content-skeleton";

type FlagSummary = { flagKey: string; total: number };

type FlagUsageMetricsProps = {
  data: FlagUsageData;
  isLoading: boolean;
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
  allFlags: FlagSummary[];
  selectedFlagKey: string;
  setSelectedFlagKey: (key: string) => void;
};

const STALE_THRESHOLD = 100;

export function FlagUsageMetrics({
  data,
  isLoading,
  allFlags,
  selectedFlagKey,
  setSelectedFlagKey,
  timeRange,
  setTimeRange,
}: FlagUsageMetricsProps) {
  let days = 7;
  if (timeRange === "30d") {
    days = 30;
  } else if (timeRange === "3m") {
    days = 90;
  }

  const variationChartData = useMemo(() => {
    if (!data?.dailyVariationUsage) {
      return [];
    }

    const isProjectWide =
      !selectedFlagKey || selectedFlagKey === "project-wide";

    const filteredRows = isProjectWide
      ? data.dailyVariationUsage
      : data.dailyVariationUsage.filter((r) => r.flag_key === selectedFlagKey);

    return pivotAnalyticsData(filteredRows, "variation_name", "val", days);
  }, [data.dailyVariationUsage, selectedFlagKey, days]);

  const variationKeys = useMemo(() => {
    if (variationChartData.length === 0) {
      return [];
    }
    return Object.keys(variationChartData[0]).filter((k) => k !== "date");
  }, [variationChartData]);

  if (isLoading) {
    return <AnalyticsContentSkeleton />;
  }

  const totalImpressions = data.flagDistribution.reduce(
    (sum, f) => sum + (Number(f.total) || 0),
    0
  );

  const topFlagsKeys = data.flagDistribution
    .sort((a, b) => (Number(b.total) || 0) - (Number(a.total) || 0))
    .slice(0, 5)
    .map((f) => f.flagKey);

  const chartTitle =
    !selectedFlagKey || selectedFlagKey === "project-wide"
      ? "Project-Wide Impressions by Variation"
      : `Impressions by Variation: '${selectedFlagKey}'`;

  return (
    <div className="space-y-6">
      <div className="mb-4 flex justify-end">
        <TimeRangeSelector setTimeRange={setTimeRange} timeRange={timeRange} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          description={"Total requests in the selected time range."}
          icon={Users}
          title="Total Impressions"
          value={totalImpressions.toLocaleString()}
        />
        <MetricCard
          description={"Flags with traffic in this period."}
          icon={TrendingUp}
          title="Active Flags"
          value={data.flagDistribution.length.toString()}
        />
        <MetricCard
          description="Traffic below 100 impressions."
          icon={Clock}
          title="Stale Flags"
          value={data.flagDistribution
            .filter((f) => (Number(f.total) || 0) < STALE_THRESHOLD)
            .length.toString()}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnalyticsCard className="p-5">
          <h3 className="mb-4 font-semibold text-lg">
            Overall Project Impression Trend
          </h3>
          <ResponsiveContainer height={300} width="100%">
            <LineChart data={data.dailyImpressions}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(str) => format(str, "MMM dd")}
              />
              <YAxis tickFormatter={(val) => val.toLocaleString()} />
              <Tooltip content={CustomTooltipForFlagUageMetrics} />
              <Line
                dataKey="impressions"
                dot={false}
                stroke={CHART_LINE_COLORS[0]}
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard className="flex flex-col space-y-4 p-5">
          <h3 className="font-semibold text-lg">{chartTitle}</h3>
          <Select
            onValueChange={setSelectedFlagKey}
            value={selectedFlagKey || "project-wide"}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Flag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project-wide">
                Project-Wide Aggregate
              </SelectItem>
              {allFlags.map((flag) => (
                <SelectItem key={flag.flagKey} value={flag.flagKey}>
                  {flag.flagKey}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ResponsiveContainer height={300} width="100%">
            <LineChart data={variationChartData}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(str) => format(str, "MMM dd")}
              />
              <YAxis />
              <Tooltip content={CustomTooltipForFlagUageMetrics} />
              <Legend />
              {variationKeys.map((key, index) => (
                <Line
                  dataKey={key}
                  dot={false}
                  key={key}
                  name={key}
                  stroke={CHART_LINE_COLORS[index % CHART_LINE_COLORS.length]}
                  strokeWidth={2}
                  type="monotone"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard className="p-5">
          <h3 className="mb-4 font-semibold text-lg">Top 5 Most Used Flags</h3>
          <ResponsiveContainer height={300} width="100%">
            <LineChart data={data.dailyTopFlagImpressions}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(str) => format(str, "MMM dd")}
              />
              <YAxis />
              <Tooltip content={CustomTooltipForFlagUageMetrics} />
              <Legend />
              {topFlagsKeys.map((key, index) => (
                <Line
                  dataKey={key}
                  dot={false}
                  key={key}
                  stroke={CHART_LINE_COLORS[index % CHART_LINE_COLORS.length]}
                  type="monotone"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>
    </div>
  );
}
