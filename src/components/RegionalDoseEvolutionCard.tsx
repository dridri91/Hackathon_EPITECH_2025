import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { loadRegionsData, type RegionForecast } from '@/lib/regionsForecast';

const COLORS = {
  historical: '#0f9c08ff',
  prediction: '#42c646ff',
};

export default function RegionalDoseEvolutionCard() {
  const [data, setData] = useState<RegionForecast[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('Île-de-France');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegionsData('DOSES(J07E1)')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const regions = Array.from(new Set(data.map(d => d.region))).sort();
  const regionData = data
    .filter(d => d.region === selectedRegion)
    .sort((a, b) => a.year - b.year);

  const chartData = regionData.map(d => ({
    year: d.year.toString(),
    actes: d.actes,
    isPrediction: d.isPrediction,
  }));

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const totalHistorical = regionData
    .filter(d => !d.isPrediction)
    .reduce((sum, d) => sum + d.actes, 0);

  const avgHistorical = Math.round(totalHistorical / regionData.filter(d => !d.isPrediction).length);
  const prediction2025 = regionData.find(d => d.year === 2025)?.actes || 0;
  const change = prediction2025 - avgHistorical;
  const changePercent = ((change / avgHistorical) * 100).toFixed(1);

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Chargement des données régionales...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Évolution des Doses Vaccinales</CardTitle>
            <CardDescription>Par région, avec prévision 2025</CardDescription>
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Sélectionner une région" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {/* Summary Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						<div className="border rounded-lg p-4 bg-muted/30">
							<p className="text-xs text-muted-foreground">Moyenne 2021-2024</p>
							<p className="text-2xl font-bold">{formatNumber(avgHistorical)}</p>
						</div>

						<div className="border rounded-lg p-4 bg-muted/30 space-y-1">
							<p className="text-xs text-muted-foreground">Prévision 2025</p>
							<p className="text-2xl font-bold text-destructive">{formatNumber(prediction2025)}</p>
						</div>

						<div className="border rounded-lg p-4 bg-muted/30">
							<p className="text-xs text-muted-foreground">Variation</p>
							<p className={`text-2xl font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
								{change >= 0 ? '+' : ''}{changePercent}%
							</p>
						</div>
					</div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumber}
              />
							<Legend formatter={(value, entry) => (
    <span style={{ color: '#000000' }}>{value}</span>
  )}/>
              <Tooltip 
                formatter={(value: number) => [formatNumber(value), 'Actes']}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="actes" 
                name="Actes vaccinaux"
                radius={[8, 8, 0, 0]}
								fill={COLORS.historical}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isPrediction ? COLORS.prediction : COLORS.historical}
                    opacity={entry.isPrediction ? 0.7 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}