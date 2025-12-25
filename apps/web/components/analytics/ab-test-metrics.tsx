"use client";

import { MetricCard } from "@flagix/ui/components/metric-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@flagix/ui/components/select";
import { Beaker } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ABTestChart } from "@/components/analytics/ab-test-chart";
import { ABTestVariationTable } from "@/components/analytics/ab-test-variation-table";
import { TimeRangeSelector } from "@/components/analytics/time-range-selector";
import type { ABTestResponse } from "@/lib/queries/analytics";
import type { TimeRange } from "@/types/analytics";
import { pivotAnalyticsData } from "@/utils/analytics";
import { AnalyticsContentSkeleton } from "./analytics-content-skeleton";

type ABTestMetricsProps = {
  results: ABTestResponse;
  isLoading: boolean;
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
  selectedExperimentKey: string | null;
  setSelectedExperimentKey: (key: string | null) => void;
};

export function ABTestMetrics({
  results,
  isLoading,
  timeRange,
  setTimeRange,
  selectedExperimentKey,
  setSelectedExperimentKey,
}: ABTestMetricsProps) {
  const { experiments = [] } = results || {};
  const [selectedEnvId, setSelectedEnvId] = useState<string>("");

  const uniqueFlags = useMemo(() => {
    const keys = new Set<string>();
    return experiments.filter((exp) => {
      if (keys.has(exp.flagKey)) {
        return false;
      }
      keys.add(exp.flagKey);
      return true;
    });
  }, [experiments]);

  const availableEnvironments = useMemo(() => {
    return experiments.filter((exp) => exp.flagKey === selectedExperimentKey);
  }, [experiments, selectedExperimentKey]);

  useEffect(() => {
    if (experiments.length > 0) {
      if (selectedExperimentKey) {
        const envStillValid = availableEnvironments.some(
          (e) => e.environmentResults[0].environmentId === selectedEnvId
        );
        if (!envStillValid && availableEnvironments.length > 0) {
          setSelectedEnvId(
            availableEnvironments[0].environmentResults[0].environmentId
          );
        }
      } else {
        setSelectedExperimentKey(experiments[0].flagKey);
        setSelectedEnvId(experiments[0].environmentResults[0].environmentId);
      }
    }
  }, [
    experiments,
    selectedExperimentKey,
    availableEnvironments,
    selectedEnvId,
    setSelectedExperimentKey,
  ]);

  const days = useMemo(() => {
    if (timeRange === "30d") {
      return 30;
    }
    if (timeRange === "3m") {
      return 90;
    }
    return 7;
  }, [timeRange]);

  const activeExperiment = experiments.find(
    (exp) =>
      exp.flagKey === selectedExperimentKey &&
      exp.environmentResults[0].environmentId === selectedEnvId
  );

  const selectedEnvResults = activeExperiment?.environmentResults[0];

  const chartData = useMemo(() => {
    if (!activeExperiment?.dailyTrend) {
      return [];
    }
    return pivotAnalyticsData(
      activeExperiment.dailyTrend,
      "variation_name",
      "conversion_rate",
      days
    );
  }, [activeExperiment, days]);

  if (isLoading) {
    return <AnalyticsContentSkeleton />;
  }

  if (experiments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50/50 py-20 text-gray-500">
        <Beaker className="mb-4 h-10 w-10 text-gray-300" />
        <p className="font-medium text-lg">No active A/B tests found</p>
      </div>
    );
  }

  const totalParticipants =
    selectedEnvResults?.variations.reduce(
      (sum, v) => sum + v.participants,
      0
    ) || 0;
  const winningVariation = selectedEnvResults?.variations.find(
    (v) => v.status === "winning"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-1">
          <div className="ml-1 font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Experiment
          </div>
          <Select
            onValueChange={setSelectedExperimentKey}
            value={selectedExperimentKey || ""}
          >
            <SelectTrigger className="w-full border-gray-300">
              <SelectValue placeholder="Select experiment" />
            </SelectTrigger>
            <SelectContent>
              {uniqueFlags.map((exp) => (
                <SelectItem key={exp.flagKey} value={exp.flagKey}>
                  {exp.experimentName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-1">
          <div className="ml-1 font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Environment
          </div>
          <Select onValueChange={setSelectedEnvId} value={selectedEnvId}>
            <SelectTrigger className="w-full border-gray-300">
              <div className="flex items-center gap-2">
                <SelectValue placeholder="Select environment" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {availableEnvironments.map((env) => (
                <SelectItem
                  key={env.environmentResults[0].environmentId}
                  value={env.environmentResults[0].environmentId}
                >
                  {env.environmentResults[0].environmentName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <div className="ml-1 font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Time Range
          </div>
          <TimeRangeSelector
            setTimeRange={setTimeRange}
            timeRange={timeRange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          description={`Traffic in ${activeExperiment?.environmentResults[0].environmentName}`}
          title="Total Participants"
          value={totalParticipants.toLocaleString()}
        />
        <MetricCard
          description={
            winningVariation
              ? `Lift: ${winningVariation.lift.toFixed(2)}%`
              : "Calculating..."
          }
          title="Top Performer"
          value={winningVariation ? winningVariation.name : "Inconclusive"}
        />
        <MetricCard
          description={`Baseline: ${activeExperiment?.controlVariation}`}
          title="Primary Metric"
          value={activeExperiment?.metric || "Conversion"}
        />
      </div>

      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-gray-100 border-b bg-gray-50/30 px-6 py-4">
            <h3 className="flex items-center font-semibold text-gray-900">
              Performance Breakdown
            </h3>
          </div>
          <ABTestVariationTable
            controlVariation={activeExperiment?.controlVariation || ""}
            TABLE_GRID_COLS="grid grid-cols-[1.5fr_repeat(6,1fr)]"
            variations={selectedEnvResults?.variations || []}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900">
              Conversion Rate Trend
            </h2>
            <p className="text-gray-500 text-sm">
              Visualizing data for {activeExperiment?.experimentName}
            </p>
          </div>
          <ABTestChart
            controlKey={activeExperiment?.controlVariation || ""}
            dailyData={chartData}
            variationKeys={
              selectedEnvResults?.variations.map((v) => v.name) || []
            }
          />
        </div>
      </div>
    </div>
  );
}
