"use client";

import { Button } from "@flagix/ui/components/button";
import type { AnalyticsTab } from "@/types/analytics";

type AnalyticsTabsProps = {
  selectedTab: AnalyticsTab;
  setSelectedTab: (tab: AnalyticsTab) => void;
};

const tabs = [
  { id: "usage", name: "Flag Usage" },
  { id: "ab-test", name: "A/B Test Metrics" },
];

export function AnalyticsTabs({
  selectedTab,
  setSelectedTab,
}: AnalyticsTabsProps) {
  return (
    <div className="flex items-center justify-between border-gray-200 border-b">
      <div className="scrollbar-hide flex space-x-6 overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <Button
            className={`relative px-0 py-3 font-medium text-sm transition-colors ${
              selectedTab === tab.id
                ? "text-emerald-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as AnalyticsTab)}
          >
            {tab.name}
            {selectedTab === tab.id && (
              <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-emerald-600" />
            )}
          </Button>
        ))}
      </div>
      <div className="flex-shrink-0" />
    </div>
  );
}
