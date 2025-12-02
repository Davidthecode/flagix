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
import { Clock, TrendingUp, Users, Zap } from "lucide-react";
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
import type { TimeRange } from "@/types/analytics";
import { CustomTooltipForFlagUageMetrics } from "@/utils/chart";

type FlagSummary = { flagKey: string; total: number };
type DailyUsage = { date: string; impressions: number };
type FlagVariationDistribution = {
  flagKey: string;
  on: number;
  off: number;
  total: number;
};
type MockUsageData = {
  dailyImpressions: DailyUsage[];
  flagDistribution: FlagVariationDistribution[];
  dailyVariationUsageProjectWide: Array<{ [key: string]: number | string }>;
  dailyTopFlagImpressions: Array<{ [key: string]: number | string }>;
};

type FlagUsageMetricsProps = {
  data: MockUsageData;
  isLoading: boolean;
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
  allFlags: FlagSummary[];
  selectedFlagKey: string;
  setSelectedFlagKey: (key: string) => void;
};

const VARIATION_COLORS = {
  on: CHART_LINE_COLORS[0],
  off: CHART_LINE_COLORS[1],
  primary: CHART_LINE_COLORS[0],
  secondary: "#34D399",
};

export function FlagUsageMetrics({
  data,
  isLoading,
  allFlags,
  selectedFlagKey,
  setSelectedFlagKey,
  timeRange,
  setTimeRange,
}: FlagUsageMetricsProps) {
  if (isLoading) {
    return <p>Loading usage data...</p>;
  }

  const totalImpressions = data.flagDistribution.reduce(
    (sum, f) => sum + f.total,
    0
  );
  const totalFlags = data.flagDistribution.length;
  const staleFlags = data.flagDistribution.filter((f) => f.total < 1000).length;
  const avgResponseTime = "12ms";

  const topFlagsKeys = data.flagDistribution
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((f) => f.flagKey);

  const topFlagsChartData = data.dailyTopFlagImpressions;
  const chartData = data.dailyVariationUsageProjectWide;
  let chartTitle = "Project-Wide Impressions by Variation";
  let variationKeys: string[] = [];

  const allVariationKeys = Object.keys(
    data.dailyVariationUsageProjectWide[0] || {}
  ).filter((key) => key !== "date");

  if (selectedFlagKey && selectedFlagKey !== "project-wide") {
    chartTitle = `Impressions by Variation: '${selectedFlagKey}'`;
  }

  variationKeys = allVariationKeys;

  return (
    <div className="space-y-6">
      <div className="mb-4 flex justify-end">
        <TimeRangeSelector setTimeRange={setTimeRange} timeRange={timeRange} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          description="Total flag evaluation requests in the last 7 days."
          icon={Users}
          title="Total Impressions"
          value={totalImpressions.toLocaleString()}
        />
        <MetricCard
          description="Number of flags with traffic in the last 7 days."
          icon={TrendingUp}
          title="Active Flags"
          value={totalFlags.toString()}
        />
        <MetricCard
          description="Flags with traffic below the threshold (candidates for deletion)."
          icon={Clock}
          title="Stale Flags"
          value={staleFlags.toString()}
        />
        <MetricCard
          description="Average response time for flag evaluation SDK requests."
          icon={Zap}
          title="Avg Response Time"
          value={avgResponseTime}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnalyticsCard className="p-5">
          <h3 className="mb-4 font-semibold text-lg">
            Overall Project Impression Trend
          </h3>
          <ResponsiveContainer height={300} width="100%">
            <LineChart
              data={data.dailyImpressions}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tickFormatter={(dateStr) => format(dateStr, "MMM dd")}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="#6b7280"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={CustomTooltipForFlagUageMetrics} />
              <Line
                dataKey="impressions"
                dot={false}
                name="All Impressions"
                stroke={VARIATION_COLORS.primary}
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard className="flex flex-col space-y-4 p-5">
          <h3 className="font-semibold text-lg">{chartTitle}</h3>
          <div className="w-fit">
            <Select onValueChange={setSelectedFlagKey} value={selectedFlagKey}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select Flag for Detail" />
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
          </div>

          <ResponsiveContainer height={300} width="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tickFormatter={(dateStr) => format(dateStr, "MMM dd")}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="#6b7280"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={CustomTooltipForFlagUageMetrics} />
              <Legend />
              {variationKeys.map((key, index) => (
                <Line
                  dataKey={key}
                  dot={false}
                  key={key}
                  name={`Variation: ${key}`}
                  stroke={CHART_LINE_COLORS[index % CHART_LINE_COLORS.length]}
                  strokeWidth={2}
                  type="monotone"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard className="p-5">
          <h3 className="mb-4 font-semibold text-lg">
            Top 5 Most Used Flags (Impression Volume)
          </h3>
          <div className="mb-2 text-gray-500 text-sm">
            Showing: {topFlagsKeys.join(", ")}
          </div>
          <ResponsiveContainer height={300} width="100%">
            <LineChart
              data={topFlagsChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tickFormatter={(dateStr) => format(dateStr, "MMM dd")}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="#6b7280"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={CustomTooltipForFlagUageMetrics} />
              <Legend />
              {topFlagsKeys.map((key, index) => (
                <Line
                  dataKey={key}
                  dot={false}
                  key={key}
                  name={key}
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
