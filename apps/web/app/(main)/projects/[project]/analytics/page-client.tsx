"use client";

import { Button } from "@flagix/ui/components/button";
import { MetricCard } from "@flagix/ui/components/metric-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@flagix/ui/components/tabs";
import { cn } from "@flagix/ui/lib/utils";
import { BarChart, ChevronDown, TrendingUp } from "lucide-react";

// Mock Data
const MOCK_ANALYTICS = {
  flagUsage: [
    { key: "dark-mode-beta", impressions: 85_000, percentage: 10.2 },
    { key: "new-homepage-banner", impressions: 500_000, percentage: 98.1 },
    { key: "pricing-v2", impressions: 12_000, percentage: 1.5 },
  ],
  abTestResults: [
    { flag: "pricing-v2", variant: "Original", conversions: 120, rate: 2.1 },
    { flag: "pricing-v2", variant: "New Layout", conversions: 180, rate: 3.2 },
  ],
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mt-8">
        <h2 className="mb-6 flex items-center gap-3 font-bold text-2xl text-gray-800">
          <BarChart className="h-6 w-6 text-emerald-600" /> Flag Evaluation
          Analytics
        </h2>

        <Tabs defaultValue="usage">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <TabsList>
              <TabsTrigger value="usage">Flag Usage</TabsTrigger>
              <TabsTrigger value="abtest">A/B Test Results</TabsTrigger>
              <TabsTrigger value="errors">SDK Errors</TabsTrigger>
            </TabsList>
            <Button className="flex items-center gap-1" variant="ghost">
              Last 7 Days <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent
            className="grid grid-cols-1 gap-6 space-y-6 lg:grid-cols-3"
            value="usage"
          >
            {/* The Metric Card is now outside the usage block to align with the grid */}
            <MetricCard
              className="lg:col-span-1"
              description="Total number of flag evaluations across all environments."
              title="Total Impressions (Last 7 Days)"
              value="1.5M"
            />

            <div className="rounded-xl border bg-white p-6 shadow-lg lg:col-span-2">
              <h3 className="mb-6 font-semibold text-gray-700 text-xl">
                Top Flag Usage
              </h3>

              {/* Placeholder for chart */}
              <div className="mb-6 flex h-64 items-center justify-center rounded-xl border-2 border-gray-200 border-dashed bg-gray-50 text-gray-500/80">
                <span className="font-medium text-lg">
                  Flag Usage Bar Chart Placeholder
                </span>
              </div>

              <ul className="divide-y divide-gray-100">
                {MOCK_ANALYTICS.flagUsage.map((item) => (
                  <li
                    className="flex items-center justify-between py-4 text-base"
                    key={item.key}
                  >
                    <span className="rounded-md bg-emerald-70 px-2 py-1 font-mono text-emerald-600">
                      {item.key}
                    </span>
                    <div className="flex items-center gap-6 text-gray-700">
                      <span className="text-sm">
                        {item.impressions.toLocaleString()} Impressions
                      </span>
                      <span
                        className={cn(
                          "font-bold",
                          item.percentage > 10
                            ? "text-green-600"
                            : "text-yellow-600"
                        )}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent className="space-y-6" value="abtest">
            <div className="rounded-xl border bg-white p-6 shadow-lg">
              <h3 className="mb-6 font-semibold text-gray-700 text-xl">
                A/B Test Conversion Rates (Flag: pricing-v2)
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {MOCK_ANALYTICS.abTestResults.map((result) => (
                  <MetricCard
                    className="col-span-1 border-emerald-200"
                    description={`${result.conversions} Total Conversions`}
                    key={result.variant}
                    subValue="Conversion Rate"
                    title={`Variant: ${result.variant}`}
                    value={
                      <span className="font-extrabold text-4xl text-emerald-600">
                        {result.rate}%
                      </span>
                    }
                  />
                ))}
                {/* Adding a comparison metric card */}
                <MetricCard
                  className="col-span-1 border-green-200 bg-green-50"
                  description="The difference in performance between New Layout and Original."
                  subValue="Statistical Significance: 95%"
                  title="Uplift"
                  value={
                    <span className="font-extrabold text-4xl text-green-700">
                      +1.1%
                    </span>
                  }
                />
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-base text-green-700">
                <TrendingUp className="h-5 w-5 shrink-0" />
                <span className="font-medium">
                  Variant "New Layout" is currently outperforming "Original" by
                  1.1% conversion rate (3.2% vs 2.1%).
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            className="space-y-6 rounded-xl border bg-white p-6 shadow-lg"
            value="errors"
          >
            <h3 className="mb-4 font-semibold text-gray-700 text-xl">
              SDK Error Reporting (Last 24 Hours)
            </h3>
            <p className="text-gray-500">
              This area would show a dashboard of recent SDK errors, such as
              connection timeouts, configuration parsing failures, or
              unauthorized access attempts.
            </p>
            <div className="flex h-32 items-center justify-center rounded-lg border border-red-300 border-dashed bg-red-50 text-red-500">
              <span className="font-medium">
                No critical errors reported in the last 24 hours.
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
