import { Card } from './ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type RegionData = {
  name: string;
  vaccinationRate: number;
  urgencyVisits: number;
  vaccineStock: number;
  ias: number;
  sosMedecins?: number;
};

function genMonthlySeries(base: number, points = 24, amp = 0.15) {
  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1);
    const wave = Math.sin(t * Math.PI * 2.2) * amp + Math.cos(t * Math.PI * 0.9) * (amp * 0.35);
    const value = Math.max(0, base * (1 + wave));
    return { m: `M${(i + 1).toString().padStart(2, '0')}`, v: Math.round(value) };
  });
}

export function OverviewCharts({ regionsData }: { regionsData: Record<string, RegionData> }) {
  const entries = Object.values(regionsData);

  // Vaccinations (moyenne nationale, % — 24 mois)
  const avgVacc = entries.reduce((a, e) => a + (Number(e.vaccinationRate) || 0), 0) / (entries.length || 1);
  const vaccPctSeries = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    const wave = 0.06 * Math.sin(t * Math.PI * 1.6) + 0.04 * Math.cos(t * Math.PI * 0.9);
    const v = Math.max(0, Math.min(100, avgVacc * (1 + wave)));
    return { m: `M${(i + 1).toString().padStart(2, '0')}`, v: Math.round(v * 10) / 10 };
  });

  // Urgences (grippe) & Taux d'hospitalisation après urgences — 24 mois
  const totalUrg = entries.reduce((a, e) => a + (Number(e.urgencyVisits) || 0), 0);
  const urgBase = Math.max(100, Math.round(totalUrg / 24));
  const urgHospSeries = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    const urgFactor = 1 + 0.35 * Math.max(0, Math.sin(t * Math.PI * 5.2)) + 0.10 * Math.cos(t * Math.PI * 1.1);
    const hospRate = 10 + 6 * Math.max(0, Math.cos(t * Math.PI * 2.6)); // ~10–16%
    return {
      m: `M${(i + 1).toString().padStart(2, '0')}`,
      urg: Math.round(urgBase * urgFactor),
      hosp: Math.round(hospRate * 10) / 10,
    };
  });

  // IAS (moyenne nationale) — 24 mois
  const avgIAS = entries.reduce((a, e) => a + (Number(e.ias) || 0), 0) / (entries.length || 1);
  const iasSeries = genMonthlySeries(Math.max(50, avgIAS), 24, 0.5);

  // Taux par région (statique)
  const byRegion = entries
    .map((r) => ({ region: r.name, taux: Number(r.vaccinationRate) || 0 }))
    .sort((a, b) => a.region.localeCompare(b.region));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="mb-3">Évolution des vaccinations (moyenne nationale, % — mensuel)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={vaccPctSeries}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="m" className="text-sm" />
            <YAxis className="text-sm" domain={[0, 100]} />
            <Tooltip formatter={(v: any) => [`${v}%`, 'Vaccination']} labelFormatter={(l) => l} />
            <Legend />
            <Area type="monotone" dataKey="v" name="Vaccinations (%)" stroke="none" fill="#10b981" fillOpacity={0.2} />
            <Line type="monotone" dataKey="v" name="Vaccinations (%)" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-3">Passages aux urgences (grippe) & Taux d'hospitalisation (mensuel)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={urgHospSeries}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="m" className="text-sm" />
            <YAxis yAxisId="left" className="text-sm" />
            <YAxis yAxisId="right" orientation="right" className="text-sm" domain={[0, 100]} />
            <Tooltip labelFormatter={(l) => l} formatter={(v: any, n: any) => n === 'hosp' ? [`${v}%`, 'Taux hosp.'] : [v, 'Urgences (grippe)']} />
            <Legend />
            <Bar yAxisId="left" dataKey="urg" name="Urgences (grippe)" fill="#10b981" />
            <Line yAxisId="right" type="monotone" dataKey="hosp" name="Taux hosp. (%)" stroke="#34d399" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-3">Taux de vaccination par région</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={byRegion} layout="vertical" margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" domain={[0, 100]} className="text-sm" />
            <YAxis type="category" dataKey="region" className="text-sm" width={160} interval={0} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: any) => [`${v}%`, 'Taux']} labelFormatter={(l) => l} />
            <Legend />
            <Bar dataKey="taux" name="Taux (%)" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-3">Indicateur Avancé Sanitaire (IAS — mensuel)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={iasSeries}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="m" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip formatter={(v: any) => [v, 'IAS']} labelFormatter={(l) => l} />
            <Legend />
            <Area type="monotone" dataKey="v" name="IAS" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-muted-foreground">Séries mensuelles simulées (moyennes nationales)</p>
      </Card>
    </div>
  );
}

