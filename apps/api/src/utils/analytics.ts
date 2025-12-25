import { eachDayOfInterval, format, subDays } from "date-fns";
import { env } from "@/config/env";

type AnalyticsRow = {
  date?: string | null;
  [key: string]: unknown;
};

type ChartDataNode = {
  date: string;
  [key: string]: string | number;
};

export function pivotAnalyticsData(
  rows: AnalyticsRow[],
  pivotKey: string,
  valueKey: string,
  days: number
): ChartDataNode[] {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const resultObj: Record<string, ChartDataNode> = {};

  for (const day of dateRange) {
    const dateStr = format(day, "yyyy-MM-dd");
    resultObj[dateStr] = { date: dateStr };
  }

  if (rows && Array.isArray(rows)) {
    for (const row of rows) {
      const date = row.date;

      if (date && resultObj[date]) {
        const key = String(row[pivotKey]);

        const value = Number(row[valueKey]) || 0;

        const currentVal = (resultObj[date][key] as number) || 0;
        resultObj[date][key] = currentVal + value;
      }
    }
  }

  return (Object.values(resultObj) as ChartDataNode[]).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

export function fillMissingDates(
  rows: AnalyticsRow[],
  days: number
): Array<{ date: string; impressions: number }> {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const resultObj: Record<string, { date: string; impressions: number }> = {};

  for (const day of dateRange) {
    const dateStr = format(day, "yyyy-MM-dd");
    resultObj[dateStr] = { date: dateStr, impressions: 0 };
  }

  if (rows && Array.isArray(rows)) {
    for (const row of rows) {
      const date = row.date;
      if (date && resultObj[date]) {
        resultObj[date].impressions = Number(row.impressions) || 0;
      }
    }
  }

  return Object.values(resultObj).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getTinybirdCount(
  projectIds: string[],
  days = 30
): Promise<number> {
  const params = new URLSearchParams();
  for (const id of projectIds) {
    params.append("projectIds", id);
  }
  params.append("days", days.toString());

  const url = `https://api.europe-west2.gcp.tinybird.co/v0/pipes/total_evaluations.json?${params.toString()}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${env.TINYBIRD_TOKEN}` },
    });

    if (!response.ok) {
      throw new Error(`Tinybird error: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data[0]?.total || 0;
  } catch (error) {
    console.error("Failed to fetch Tinybird evaluation counts:", error);
    return 0;
  }
}
