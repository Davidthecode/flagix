export type DailyConversionData = {
  date: string;
  [variationName: string]: number | string;
};

export type TinybirdRow = {
  date: string;
  projectId: string;
  flag_key?: string;
  variation_name?: string;
  val: number;
  total?: number;
  impressions?: number;
};
