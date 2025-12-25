export type DailyConversionData = {
  date: string;
  [variationName: string]: number | string;
};

export type TinybirdUsageRow = {
  date: string | null;
  impressions: number | null;
  flag_key: string | null;
  variation_name: string | null;
  total: number | null;
  val: number | null;
};

export type ABTestSummaryRow = {
  variation_name: string;
  total_exposed: number;
  total_converted: number;
  conversion_rate: number;
};
