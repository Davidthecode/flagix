"use client";

import { Button } from "@flagix/ui/components/button";
import { cn } from "@flagix/ui/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { ABTestChart } from "@/components/analytics/ab-test-chart";
import { ABTestVariationTable } from "@/components/analytics/ab-test-variation-table";
import { TimeRangeSelector } from "@/components/analytics/time-range-selector";
import type { ABTestResult } from "@/lib/queries/analytics";
import type { TimeRange } from "@/types/analytics";
import { pivotAnalyticsData } from "@/utils/analytics";
import { AnalyticsContentSkeleton } from "./analytics-content-skeleton";

type ABTestMetricsProps = {
  results: ABTestResult[];
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
  const [selectedFlagKey, setSelectedFlagKey] = useState<string>("");
  const [selectedEnvironmentName, setSelectedEnvironmentName] =
    useState<string>("");

  let days = 7;
  if (timeRange === "30d") {
    days = 30;
  } else if (timeRange === "3m") {
    days = 90;
  }

  useEffect(() => {
    if (results.length > 0) {
      const keyToSelect = selectedExperimentKey || results[0]?.flagKey || "";
      setSelectedFlagKey(keyToSelect);
      const experiment =
        results.find((exp) => exp.flagKey === keyToSelect) || results[0];
      if (experiment?.environmentResults[0]) {
        setSelectedEnvironmentName(
          experiment.environmentResults[0].environmentName
        );
      }
    }
  }, [results, selectedExperimentKey]);

  const selectedExperiment = results.find(
    (exp) => exp.flagKey === selectedFlagKey
  );
  const selectedEnvironmentResults =
    selectedExperiment?.environmentResults.find(
      (env) => env.environmentName === selectedEnvironmentName
    );

  const chartData = useMemo(() => {
    if (!selectedExperiment?.dailyTrend) {
      return [];
    }
    return pivotAnalyticsData(
      selectedExperiment.dailyTrend,
      "variation_name",
      "conversion_rate",
      days
    );
  }, [selectedExperiment, days]);

  if (isLoading) {
    return <AnalyticsContentSkeleton />;
  }

  if (results.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        No active A/B tests found.
      </div>
    );
  }

  const handleFlagSelect = (flagKey: string) => {
    setSelectedFlagKey(flagKey);
    setSelectedExperimentKey(flagKey);
    const exp = results.find((e) => e.flagKey === flagKey);
    if (exp?.environmentResults.length) {
      setSelectedEnvironmentName(exp.environmentResults[0].environmentName);
    }
  };

  return (
    <div className="flex gap-6">
      <div className="flex h-fit w-1/4 flex-col space-y-2 rounded-md border p-4">
        <h4 className="mb-1 font-semibold text-gray-900 text-sm">
          Active Experiments
        </h4>
        {results.map((exp) => (
          <Button
            className={cn(
              "cursor-pointer rounded-lg border border-gray-100 p-3 text-left transition-colors",
              selectedFlagKey === exp.flagKey
                ? "bg-emerald-50 font-medium text-emerald-700"
                : "text-gray-700 hover:bg-[#F4F4F5]"
            )}
            key={exp.flagKey}
            onClick={() => handleFlagSelect(exp.flagKey)}
          >
            <div className="flex flex-col text-left">
              <span className="font-medium">{exp.experimentName}</span>
              <span className="text-gray-500 text-xs">Flag: {exp.flagKey}</span>
            </div>
          </Button>
        ))}
      </div>

      <div className="w-3/4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-lg">
            Experiment Details
          </h2>
          <TimeRangeSelector
            setTimeRange={setTimeRange}
            timeRange={timeRange}
          />
        </div>

        {selectedExperiment && selectedEnvironmentResults ? (
          <div className="rounded-md border p-5">
            <h3 className="font-semibold text-gray-900 text-xl">
              {selectedExperiment.experimentName}
            </h3>
            <p className="mb-4 text-gray-600 text-sm">
              Control: {selectedExperiment.controlVariation} | Metric:{" "}
              {selectedExperiment.metric}
            </p>

            <ABTestVariationTable
              controlVariation={selectedExperiment.controlVariation}
              TABLE_GRID_COLS="grid grid-cols-[1.2fr_repeat(6,1fr)]"
              variations={selectedEnvironmentResults.variations}
            />

            <div className="mt-8 rounded-lg border p-4">
              <h4 className="mb-4 font-semibold">Conversion Rate Trend</h4>
              <ABTestChart
                controlKey={selectedExperiment.controlVariation}
                dailyData={chartData}
                variationKeys={selectedEnvironmentResults.variations.map(
                  (v) => v.name
                )}
              />
            </div>
          </div>
        ) : (
          <p className="p-4 text-gray-500">
            Select an experiment to see results.
          </p>
        )}
      </div>
    </div>
  );
}
