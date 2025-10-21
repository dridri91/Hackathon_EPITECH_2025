import { Card } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { forecastVaccination } from '../utils/forecast';

type RegionData = {
  name: string;
  vaccinationRate: number;
  urgencyVisits: number;
  vaccineStock: number;
  ias: number;
};

export function DashboardCharts({ regionsData }: { regionsData: Record<string, RegionData> }) {
  const nextYear = new Date().getFullYear() + 1;
  const entries = Object.entries(regionsData).map(([key, v]) => ({ key, ...v }));
  const forecasts = forecastVaccination(entries as any, [nextYear]);

  const nationalAvgNow = entries.reduce((a, e) => a + e.vaccinationRate, 0) / (entries.length || 1);
  const nationalAvgNext = entries.reduce(
    (a, e) => a + (forecasts[e.key]?.[nextYear] ?? e.vaccinationRate),
    0,
  ) / (entries.length || 1);

  const nationalSeries = [
    { label: 'Actuel', moyenne: Math.round(nationalAvgNow * 10) / 10 },
    { label: String(nextYear), moyenne: Math.round(nationalAvgNext * 10) / 10 },
  ];

  const byRegionNext = entries
    .map((e) => ({ region: e.name, taux: forecasts[e.key]?.[nextYear] ?? e.vaccinationRate }))
    .sort((a, b) => b.taux - a.taux);

  const barChartHeight = Math.max(280, byRegionNext.length * 28);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="mb-2">Prévision par région ({nextYear})</h3>
        <ResponsiveContainer width="100%" height={barChartHeight}>
          <BarChart data={byRegionNext} layout="vertical" margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" domain={[0, 100]} className="text-sm" />
            <YAxis dataKey="region" type="category" className="text-sm" width={160} interval={0} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="taux" fill="#10b981" name={`Taux ${nextYear} (%)`} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-2">Moyenne nationale (actuel vs {nextYear})</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={nationalSeries}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="label" className="text-sm" />
            <YAxis className="text-sm" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="moyenne" stroke="#3b82f6" strokeWidth={2} name="Taux moyen (%)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

