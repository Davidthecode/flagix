import { eachDayOfInterval, format, subDays } from "date-fns";

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
