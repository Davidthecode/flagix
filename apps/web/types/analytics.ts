export type AnalyticsTab = "usage" | "ab-test";

export type TimeRange = "7d" | "30d" | "3m";

export type DailyConversionData = {
  date: string;
  [variationName: string]: number | string;
};
