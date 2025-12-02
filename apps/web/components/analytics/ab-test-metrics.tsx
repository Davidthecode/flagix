"use client";

import { Button } from "@flagix/ui/components/button";
import { cn } from "@flagix/ui/lib/utils";
import { useState } from "react";
import { ABTestChart } from "@/components/analytics/ab-test-chart";
import { ABTestVariationTable } from "@/components/analytics/ab-test-variation-table";
import { dummyDailyConversionRates } from "@/components/analytics/analytics-mocks";
import { TimeRangeSelector } from "@/components/analytics/time-range-selector";
import type { TimeRange } from "@/types/analytics";

type VariationMetrics = {
  name: string;
  conversions: number;
  participants: number;
  conversionRate: number;
  lift: number;
  significance: number;
  status: "winning" | "losing" | "tie";
};

type EnvironmentResult = {
  environmentName: string;
  environmentId: string;
  variations: VariationMetrics[];
};

type ABTestResult = {
  experimentName: string;
  flagKey: string;
  metric: string;
  controlVariation: string;
  environmentResults: EnvironmentResult[];
};

type ABTestMetricsProps = {
  results: ABTestResult[];
  isLoading: boolean;
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
  selectedExperimentKey: string;
  setSelectedExperimentKey: (key: string) => void;
};

export function ABTestMetrics({
  results,
  isLoading,
  timeRange,
  setTimeRange,
}: ABTestMetricsProps) {
  const [selectedFlagKey, setSelectedFlagKey] = useState<string>(
    results[0]?.flagKey || ""
  );
  const [selectedEnvironmentName, setSelectedEnvironmentName] =
    useState<string>(results[0]?.environmentResults[0]?.environmentName || "");

  if (isLoading) {
    return <p>Loading A/B test results...</p>;
  }

  if (results.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        No active or completed A/B tests found for this project.
      </div>
    );
  }

  const selectedExperiment = results.find(
    (exp) => exp.flagKey === selectedFlagKey
  );

  const selectedEnvironmentResults =
    selectedExperiment?.environmentResults.find(
      (env) => env.environmentName === selectedEnvironmentName
    );

  const TABLE_GRID_COLS = "grid grid-cols-[1.2fr_repeat(6,1fr)]";

  const handleFlagSelect = (flagKey: string) => {
    setSelectedFlagKey(flagKey);
    const newExperiment = results.find((exp) => exp.flagKey === flagKey);
    if (newExperiment?.environmentResults.length) {
      setSelectedEnvironmentName(
        newExperiment.environmentResults[0].environmentName
      );
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
              "cursor-pointer rounded-lg border border-gray-100 p-3 text-sm transition-colors",
              selectedFlagKey === exp.flagKey
                ? "bg-emerald-50 font-medium text-emerald-700"
                : "text-gray-700 hover:bg-[#F4F4F5]"
            )}
            key={exp.flagKey}
            onClick={() => handleFlagSelect(exp.flagKey)}
          >
            <div className="flex flex-col">
              <div className="font-medium">{exp.experimentName}</div>
              <div className="text-gray-500 text-xs">Flag: {exp.flagKey}</div>
              <div className="font-normal text-gray-400 text-xs">
                (
                {exp.environmentResults
                  .map((r) => r.environmentName)
                  .join(", ")}
                )
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div className="w-3/4 space-y-6">
        <div className="flex items-center justify-between">
          {selectedExperiment &&
          selectedExperiment.environmentResults.length > 1 ? (
            <div className="flex space-x-2 border-gray-200 border-b">
              {selectedExperiment.environmentResults.map((env) => (
                <Button
                  className={cn(
                    "rounded-none px-3 py-2 font-medium text-sm transition-colors",
                    selectedEnvironmentName === env.environmentName
                      ? "border-emerald-600 border-b-2 text-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                  key={env.environmentName}
                  onClick={() =>
                    setSelectedEnvironmentName(env.environmentName)
                  }
                >
                  {env.environmentName}
                </Button>
              ))}
            </div>
          ) : (
            <h2 className="font-semibold text-gray-900 text-lg">
              {selectedEnvironmentName
                ? `Results for ${selectedEnvironmentName}`
                : "Experiment Details"}
            </h2>
          )}

          <TimeRangeSelector
            setTimeRange={setTimeRange}
            timeRange={timeRange}
          />
        </div>

        {!selectedExperiment || !selectedEnvironmentResults ? (
          <p className="p-4 text-gray-500">
            Please select an experiment to view detailed results.
          </p>
        ) : (
          <div className="rounded-md border p-5">
            <h3 className="font-semibold text-gray-900 text-xl">
              {selectedExperiment.experimentName}
            </h3>
            <p className="mb-4 text-gray-600 text-sm">
              Flag: {selectedExperiment.flagKey} | Metric:
              {selectedExperiment.metric} | Control:
              {selectedExperiment.controlVariation}
            </p>

            <ABTestVariationTable
              controlVariation={selectedExperiment.controlVariation}
              TABLE_GRID_COLS={TABLE_GRID_COLS}
              variations={selectedEnvironmentResults.variations}
            />

            <div className="mt-8">
              <h4 className="mb-4 font-semibold text-gray-900 text-lg">
                Conversion Rate Trend ({selectedEnvironmentName})
              </h4>
              <div className="rounded-lg border p-4">
                <ABTestChart
                  controlKey={selectedExperiment.controlVariation}
                  dailyData={dummyDailyConversionRates}
                  variationKeys={selectedEnvironmentResults.variations.map(
                    (v) => v.name
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
