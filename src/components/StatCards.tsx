import { Card } from './ui/card';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

type RegionData = {
  name: string;
  vaccinationRate: number;
  urgencyVisits: number;
  vaccineStock: number;
  ias: number;
  sosMedecins?: number;
};

export function StatCards({ regionsData }: { regionsData: Record<string, RegionData> }) {
  const entries = Object.values(regionsData);

  // KPI 1: Évolution des vaccinations (moyenne nationale + delta mock)
  const avgVacc = entries.reduce((a, e) => a + (Number(e.vaccinationRate) || 0), 0) / (entries.length || 1);
  const evolVaccDelta = 2.1; // mock Δ vs semaine dernière

  // Helper: generate deterministic 8-point series around a base value
  const genSeries = (base: number, points = 8, amplitude = 0.06, clamp0to100 = false) =>
    Array.from({ length: points }, (_, i) => {
      const factor = 1 + amplitude * Math.sin((i / (points - 1)) * Math.PI * 1.2);
      let v = base * factor;
      if (clamp0to100) v = Math.max(0, Math.min(100, v));
      return { w: `S${i + 1}`, v: Math.round(v * 10) / 10 };
    });

  const vaccSeries = genSeries(avgVacc, 8, 0.07, true);

  // KPI 2: Urgences & SOS Médecins (sommes nationales)
  const totalUrgences = entries.reduce((a, e) => a + (Number(e.urgencyVisits) || 0), 0);
  const totalSOS = entries.reduce(
    (a, e) => a + (Number(e.sosMedecins) || Math.round((Number(e.urgencyVisits) || 0) * 0.6)),
    0,
  );
  const urgBase = totalUrgences / 8;
  const sosBase = totalSOS / 8;
  const urgSosSeries = Array.from({ length: 8 }, (_, i) => {
    const f = 1 + 0.08 * Math.sin((i / 7) * Math.PI * 1.4);
    const g = 1 + 0.06 * Math.cos((i / 7) * Math.PI * 1.1);
    return { w: `S${i + 1}`, urg: Math.round(urgBase * f), sos: Math.round(sosBase * g) };
  });

  // KPI 3: Top / Pire 3 taux de vaccination par région
  const sortedByVacc = [...entries].sort((a, b) => a.vaccinationRate - b.vaccinationRate);
  const worst3 = sortedByVacc.slice(0, 3);
  const top3 = sortedByVacc.slice(-3).reverse();

  // KPI 4: IAS moyen (statut)
  const avgIAS = Math.round(entries.reduce((a, e) => a + (Number(e.ias) || 0), 0) / (entries.length || 1));
  const iasLevel = avgIAS > 170 ? 'Élevé' : avgIAS > 120 ? 'Moyen' : 'Faible';
  const iasLevelColor = avgIAS > 170 ? 'text-red-600' : avgIAS > 120 ? 'text-amber-600' : 'text-emerald-600';
  const iasSeries = genSeries(avgIAS, 8, 0.09);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Évolution des vaccinations */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground mb-1">Évolution des vaccinations</p>
            <h3 className="mb-2">{vaccSeries[vaccSeries.length - 1].v}%</h3>
            <div className={`flex items-center gap-1 text-sm ${evolVaccDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-4 h-4 ${evolVaccDelta < 0 ? 'rotate-180' : ''}`} />
              <span>{evolVaccDelta >= 0 ? '+' : ''}{evolVaccDelta.toFixed(1)}% vs semaine dernière</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        <div className="mt-4 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vaccSeries} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="w" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip cursor={{ stroke: '#94a3b8', strokeDasharray: '3 3' }} formatter={(v: any) => [`${v}%`, 'Vaccination']} labelFormatter={() => ''} />
              <Area type="monotone" dataKey="v" stroke="none" fill="#10b981" fillOpacity={0.18} />
              <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Urgences & SOS Médecins */}
      <Card className="p-6">
        <p className="text-muted-foreground mb-1">Urgences & SOS Médecins</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Urgences</span>
            <span className="font-semibold">{totalUrgences.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">SOS Médecins</span>
            <span className="font-semibold">{totalSOS.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-4 p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-md inline-flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-emerald-600" />
          <span className="text-xs text-emerald-700 dark:text-emerald-300">Surveillance active</span>
        </div>
        <div className="mt-4 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={urgSosSeries} margin={{ top: 2, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="w" hide />
              <YAxis hide />
              <Tooltip formatter={(v: any, n: any) => [v, n === 'urg' ? 'Urgences' : 'SOS Médecins']} labelFormatter={() => ''} />
              <Bar dataKey="urg" fill="#10b981" radius={[2, 2, 0, 0]} barSize={10} />
              <Bar dataKey="sos" fill="#34d399" radius={[2, 2, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top / Pire 3 par région */}
      <Card className="p-6">
        <p className="text-muted-foreground mb-3">Taux de vaccination (Top / Pire 3)</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="mb-2 font-medium">Top 3</p>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top3.map(r => ({ name: r.name, v: r.vaccinationRate }))} layout="vertical" margin={{ left: 8, right: 8, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Taux']} labelFormatter={(l) => l} />
                  <Bar dataKey="v" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="mb-2 font-medium">Pire 3</p>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={worst3.map(r => ({ name: r.name, v: r.vaccinationRate }))} layout="vertical" margin={{ left: 8, right: 8, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Taux']} labelFormatter={(l) => l} />
                  <Bar dataKey="v" fill="#34d399" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>

      {/* IAS */}
      <Card className="p-6">
        <p className="text-muted-foreground mb-1">Indicateur avancé sanitaire (IAS)</p>
        <h3 className="mb-2">{avgIAS}</h3>
        <p className={`text-sm font-medium ${iasLevelColor}`}>{iasLevel}</p>
        <div className="mt-4 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={iasSeries} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="w" hide />
              <YAxis hide />
              <Tooltip cursor={{ stroke: '#94a3b8', strokeDasharray: '3 3' }} formatter={(v: any) => [v, 'IAS']} labelFormatter={() => ''} />
              <Area type="monotone" dataKey="v" stroke="none" fill="#10b981" fillOpacity={0.18} />
              <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
