import type { ReactNode } from "react";

export const CustomTooltipForFlagUageMetrics = ({
  active,
  payload,
  label,
  // biome-ignore lint/suspicious/noExplicitAny:<>
}: any): ReactNode | null => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-2 text-sm shadow-sm">
        <p className="font-semibold text-gray-900">{label}</p>
        {payload.map((p) => (
          <p className="text-gray-700" key={p.name} style={{ color: p.color }}>
            {`${p.name}: ${p.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CustomTooltipForABtestMetricChart = ({
  active,
  payload,
  label,
  // biome-ignore lint/suspicious/noExplicitAny:<>
}: any): ReactNode | null => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        {payload.map((item) => (
          <p className="text-sm" key={item.name} style={{ color: item.color }}>
            {item.name}: **{(item.value * 100).toFixed(2)}%**
          </p>
        ))}
      </div>
    );
  }
  return null;
};
