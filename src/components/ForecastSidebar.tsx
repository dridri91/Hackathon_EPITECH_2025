import { Card } from './ui/card';
import { forecastVaccination } from '../utils/forecast';

type RegionData = {
  name: string;
  vaccinationRate: number;
  urgencyVisits: number;
  vaccineStock: number;
  ias: number;
};

export function ForecastSidebar({ regionsData }: { regionsData: Record<string, RegionData> }) {
  const nextYear = new Date().getFullYear() + 1;
  const entries = Object.entries(regionsData).map(([key, v]) => ({ key, ...v }));
  const forecasts = forecastVaccination(entries as any, [nextYear]);

  const list = entries
    .map((e) => ({ key: e.key, name: e.name, value: forecasts[e.key]?.[nextYear] ?? e.vaccinationRate }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card className="p-6">
      <h3 className="mb-4">Prévision {nextYear} – toutes régions</h3>
      <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
        {list.map((r) => (
          <div key={r.key} className="border-b last:border-b-0 border-slate-200 dark:border-slate-700 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{r.name}</span>
              <span className="font-medium">{r.value.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.max(0, Math.min(100, r.value))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

