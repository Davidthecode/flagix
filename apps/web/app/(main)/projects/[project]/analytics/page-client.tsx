"use client";

import { useEffect, useMemo, useState } from "react";
import { ABTestMetrics } from "@/components/analytics/ab-test-metrics";
import { AnalyticsContentSkeleton } from "@/components/analytics/analytics-content-skeleton";
import { AnalyticsTabs } from "@/components/analytics/analytics-tab";
import { FlagUsageMetrics } from "@/components/analytics/flag-usage-metrics";
import { useABTestMetrics, useFlagUsageMetrics } from "@/lib/queries/analytics";
import { useProject } from "@/providers/project";
import type { AnalyticsTab, TimeRange } from "@/types/analytics";

export default function AnalyticsPageClient() {
  const { projectId } = useProject();
  const [selectedTab, setSelectedTab] = useState<AnalyticsTab>("usage");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [selectedFlagKey, setSelectedFlagKey] = useState<string>("");
  const [selectedExperimentKey, setSelectedExperimentKey] = useState<
    string | null
  >(null);

  const {
    data: usageData,
    isLoading: isLoadingUsage,
    isFetching: isFetchingUsage,
  } = useFlagUsageMetrics(projectId, timeRange);

  const {
    data: abTestData,
    isLoading: isLoadingABTests,
    isFetching: isFetchingABTests,
  } = useABTestMetrics(projectId, timeRange);

  const abTestResults = abTestData || {
    experiments: [],
    activeEnvironments: [],
  };

  useEffect(() => {
    if (
      usageData?.flagDistribution &&
      usageData.flagDistribution.length > 0 &&
      !selectedFlagKey
    ) {
      setSelectedFlagKey(usageData.flagDistribution[0]?.flag_key || "");
    }
  }, [usageData, selectedFlagKey]);

  const renderContent = useMemo(() => {
    if (selectedTab === "usage") {
      if (isLoadingUsage) {
        return <AnalyticsContentSkeleton />;
      }
      if (usageData) {
        return (
          <FlagUsageMetrics
            allFlags={usageData.flagDistribution}
            data={usageData}
            isLoading={isFetchingUsage}
            selectedFlagKey={selectedFlagKey}
            setSelectedFlagKey={setSelectedFlagKey}
            setTimeRange={setTimeRange}
            timeRange={timeRange}
          />
        );
      }
      return null;
    }

    if (selectedTab === "ab-test") {
      if (isLoadingABTests) {
        return <AnalyticsContentSkeleton />;
      }
      return (
        <ABTestMetrics
          isLoading={isFetchingABTests}
          results={abTestResults}
          selectedExperimentKey={selectedExperimentKey}
          setSelectedExperimentKey={setSelectedExperimentKey}
          setTimeRange={setTimeRange}
          timeRange={timeRange}
        />
      );
    }

    return null;
  }, [
    selectedTab,
    isLoadingUsage,
    isLoadingABTests,
    usageData,
    isFetchingUsage,
    isFetchingABTests,
    selectedFlagKey,
    selectedExperimentKey,
    abTestResults,
    timeRange,
  ]);

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

        <div>{renderContent}</div>
      </div>
    </div>
  );
}
