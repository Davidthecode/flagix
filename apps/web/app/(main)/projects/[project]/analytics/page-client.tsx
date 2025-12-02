"use client";

import { useState } from "react";
import { ABTestMetrics } from "@/components/analytics/ab-test-metrics";
import {
  mockABTestResults,
  mockFlagUsageData,
} from "@/components/analytics/analytics-mocks";
import { AnalyticsTabs } from "@/components/analytics/analytics-tab";
import { FlagUsageMetrics } from "@/components/analytics/flag-usage-metrics";
import type { AnalyticsTab, TimeRange } from "@/types/analytics";

export default function AnalyticsPageClient() {
  const [selectedTab, setSelectedTab] = useState<AnalyticsTab>("usage");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [selectedFlagKey, setSelectedFlagKey] = useState<string>(
    mockFlagUsageData.flagDistribution[0]?.flagKey || ""
  );
  const [selectedExperimentKey, setSelectedExperimentKey] = useState<
    string | null
  >(null);

  const usageData = mockFlagUsageData;
  const abTestResults = mockABTestResults;
  const isLoading = false;

  if (isLoading) {
    return <p>Loading analytics...</p>;
  }

  return (
    <div className="py-6">
      <div className="flex flex-col space-y-4 overflow-hidden rounded-lg border border-gray-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col space-y-2">
          <div>
            <h1 className="font-semibold text-gray-900 text-xl">
              My Analytics
            </h1>
            <p className="text-gray-600 text-sm">
              Monitor feature flag adoption and experiment performance.
            </p>
          </div>
        </div>

        <AnalyticsTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        <div className="">
          {selectedTab === "usage" && (
            <FlagUsageMetrics
              allFlags={usageData.flagDistribution}
              data={usageData}
              isLoading={isLoading}
              selectedFlagKey={selectedFlagKey}
              setSelectedFlagKey={setSelectedFlagKey}
              setTimeRange={setTimeRange}
              timeRange={timeRange}
            />
          )}
          {selectedTab === "ab-test" && (
            <ABTestMetrics
              isLoading={isLoading}
              results={abTestResults}
              selectedExperimentKey={selectedExperimentKey}
              setSelectedExperimentKey={setSelectedExperimentKey}
              setTimeRange={setTimeRange}
              timeRange={timeRange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
