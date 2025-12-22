/**
 * Transforms flat Tinybird rows into component-ready JSON
 * e.g [{date: '2023-01-01', variation: 'A', val: 10}]
 * -> [{date: '2023-01-01', A: 10}]
 */
export function pivotAnalyticsData<
  T extends { date: string },
  P extends keyof T,
  V extends keyof T,
>(
  rows: T[],
  pivotKey: P,
  valueKey: V
): Array<{ date: string } & Record<string, T[V]>> {
  if (!rows || rows.length === 0) {
    return [];
  }

  const grouped = rows.reduce(
    (acc, row) => {
      const date = row.date;

      // The value of the pivotKey (e.g., 'Variation A') becomes a property name
      // We cast to string to ensure it's a valid object key
      const dynamicKey = String(row[pivotKey]);
      const value = row[valueKey];

      if (!acc[date]) {
        acc[date] = { date } as { date: string } & Record<string, T[V]>;
      }

      acc[date][dynamicKey] = value;
      return acc;
    },
    {} as Record<string, { date: string } & Record<string, T[V]>>
  );

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}
