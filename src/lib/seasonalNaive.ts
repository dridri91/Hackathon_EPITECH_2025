// src/lib/seasonalNaive.ts
export type DataPoint = { date: string; value: number }
export type ForecastPoint = { date: string; value: number }

/**
 * Seasonal Naive for an arbitrary season (e.g., Oct–Feb = [10,11,12,1,2]).
 * It finds the most recent *complete* season in history and copies month-by-month.
 * If no complete season exists, falls back to month-wise seasonal naive
 * (latest value for each month across all years).
 */
export function seasonalNaiveForSeason(
  data: DataPoint[],
  seasonMonths: number[],         // e.g. [10,11,12,1,2]
  targetYearStart: number,        // e.g. 2025 (anchor at October 2025)
): ForecastPoint[] {
  // 1) Normalize/parse and index by YYYY-MM
  const rows = data
    .map(d => ({
      date: new Date(d.date.length === 7 ? d.date + "-01" : d.date),
      value: d.value,
    }))
    .filter(d => !Number.isNaN(d.date.getTime()))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const byYM = new Map<string, number>(); // "YYYY-MM" -> value
  const ym = (y: number, m: number) => `${y}-${String(m).padStart(2, "0")}`;
  for (const r of rows) {
    byYM.set(ym(r.date.getFullYear(), r.date.getMonth() + 1), r.value);
  }

  // 2) Helper to build a season given an anchor year
  // For seasonMonths [10,11,12,1,2], anchorYear=2024 means:
  // 2024-10, 2024-11, 2024-12, 2025-01, 2025-02
  const seasonKeys = (anchorYear: number) =>
    seasonMonths.map(m => ym(m >= 10 ? anchorYear : anchorYear + 1, m));

  // 3) Find the most recent complete season available in history
  // Try latest possible anchor from max(historyYear) down to min(historyYear)-2
  const yearsInData = [...new Set(rows.map(r => r.date.getFullYear()))];
  const maxYear = yearsInData.length ? Math.max(...yearsInData) : 1900;
  const minYear = yearsInData.length ? Math.min(...yearsInData) : 1900;

  let lastCompleteSeason: { anchor: number; keys: string[] } | null = null;
  for (let anchor = maxYear; anchor >= minYear - 2; anchor--) {
    const keys = seasonKeys(anchor);
    if (keys.every(k => byYM.has(k))) {
      lastCompleteSeason = { anchor, keys };
      break;
    }
  }

  // 4) Build target months for the requested targetYearStart
  // Example targetYearStart=2025 -> [2025-10, 2025-11, 2025-12, 2026-01, 2026-02]
  const targetKeys = seasonKeys(targetYearStart);

  if (lastCompleteSeason) {
    // Copy 1-to-1 from last complete season
    return targetKeys.map((k, i) => ({
      date: k + "-01",
      value: byYM.get(lastCompleteSeason!.keys[i])!,
    }));
  }

  // 5) Fallback: month-wise seasonal naive (use latest available same-month)
  const latestByMonth = new Map<number, number>(); // month -> latest value
  for (const [key, val] of byYM) {
    const m = Number(key.slice(5, 7)); // "YYYY-MM"
    latestByMonth.set(m, val);
  }

  return targetKeys.map(k => {
    const m = Number(k.slice(5, 7));
    const v = latestByMonth.get(m);
    return { date: k + "-01", value: v ?? NaN };
  });
}

/** Convenience wrapper specifically for Oct–Feb  (flu season). */
export function seasonalNaiveOctToFeb(
  data: DataPoint[],
  targetAnchorYear: number // e.g. 2025
): ForecastPoint[] {
  return seasonalNaiveForSeason(data, [10, 11, 12, 1, 2], targetAnchorYear);
}
