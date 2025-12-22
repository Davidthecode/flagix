"use client";

import { format } from "date-fns";
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
import { CHART_LINE_COLORS } from "@/lib/constants";
import type { DailyConversionData } from "@/types/analytics";
import { CustomTooltipForABtestMetricChart } from "@/utils/chart";

type ABTestChartProps = {
  dailyData: DailyConversionData[];
  variationKeys: string[];
  controlKey: string;
};

export function ABTestChart({
  dailyData,
  variationKeys,
  controlKey,
}: ABTestChartProps) {
  return (
    <ResponsiveContainer height={300} width="100%">
      <LineChart
        data={dailyData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          tickFormatter={(dateStr) =>
            format(new Date(`${dateStr}T00:00:00`), "MMM dd")
          }
        />
        <YAxis
          domain={[0, "auto"]}
          stroke="#6b7280"
          tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
        />
        <Tooltip content={CustomTooltipForABtestMetricChart} />
        <Legend />

        {variationKeys.map((key, index) => {
          const colorIndex = key === controlKey ? 0 : index;
          const strokeColor =
            CHART_LINE_COLORS[colorIndex % CHART_LINE_COLORS.length];

          return (
            <Line
              dataKey={key}
              dot={false}
              key={key}
              name={key}
              stroke={strokeColor}
              strokeWidth={key === controlKey ? 3 : 2}
              type="monotone"
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
