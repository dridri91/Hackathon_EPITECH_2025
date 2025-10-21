export type RegionRow = {
  key: string;
  name: string;
  vaccinationRate: number; // % 0..100
  urgencyVisits: number;
  vaccineStock: number; // % 0..100
  ias: number;
};

function minMaxNormalize(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0.5);
  return values.map((v) => (v - min) / (max - min));
}

function logisticNext(r0: number, L: number, k: number, t: number) {
  const eps = 1e-6;
  const start = Math.min(Math.max(r0, eps), 0.999999);
  const A = (L - start) / start;
  return L / (1 + A * Math.exp(-k * t));
}

export function forecastVaccination(
  rows: RegionRow[],
  years: number[] = [2026, 2027, 2028, 2029]
) {
  // Normalize penalties
  const urgNorm = minMaxNormalize(rows.map((r) => r.urgencyVisits));
  const iasNorm = minMaxNormalize(rows.map((r) => r.ias));

  const result: Record<string, { [year: number]: number }> = {};

  rows.forEach((r, idx) => {
    const r0 = (Number(r.vaccinationRate) || 0) / 100;
    const stock = Math.max(0, Math.min(1, (Number(r.vaccineStock) || 0) / 100));
    const urg = urgNorm[idx];
    const ias = iasNorm[idx];

    // Saturation level per region
    let L = 0.85 + 0.07 * stock - 0.05 * urg; // base 85% +/-
    L = Math.min(0.95, Math.max(0.75, L));

    // Growth rate per year
    let k = 0.05 + 0.25 * stock - 0.15 * urg - 0.1 * ias; // bounded later
    k = Math.min(0.35, Math.max(0.02, k));

    const series: { [year: number]: number } = {};
    years.forEach((Y, i) => {
      const t = i + 1; // 2026→t=1, ... 2029→t=4
      const y = logisticNext(r0, L, k, t);
      series[Y] = Math.round(y * 1000) / 10; // one decimal
    });
    result[r.key] = series;
  });

  return result;
}

