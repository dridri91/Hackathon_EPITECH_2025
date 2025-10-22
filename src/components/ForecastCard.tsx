import { useMemo } from "react";
import type { DataPoint } from "@/lib/seasonalNaive";
import { seasonalNaiveOctToFeb } from "@/lib/seasonalNaive";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  forecast: '#4292C6',
};

export default function ForecastCard({ history }: { history: DataPoint[] }) {
  const forecast = useMemo(() => {
    try {
      // Oct 2025 → Feb 2026
      return seasonalNaiveOctToFeb(history, 2025);
    } catch {
      return [];
    }
  }, [history]);

  const chartData = forecast.map(f => ({
    month: f.date.slice(0, 7),
    value: Math.round(f.value),
  }));

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const total = forecast.reduce((sum, f) => sum + f.value, 0);
  const average = forecast.length > 0 ? Math.round(total / forecast.length) : 0;
  const max = forecast.length > 0 ? Math.max(...forecast.map(f => f.value)) : 0;
  const min = forecast.length > 0 ? Math.min(...forecast.map(f => f.value)) : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Prévision Saisonnière</CardTitle>
        <CardDescription>Oct 2025 → Fév 2026</CardDescription>
      </CardHeader>
      <CardContent>
        {forecast.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune prévision disponible.</p>
        ) : (
          <div className="space-y-5">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground">Moyenne mensuelle</p>
                <p className="text-2xl font-bold">{formatNumber(average)}</p>
              </div>

              <div className="border rounded-lg p-4 bg-muted/30 space-y-1">
                <p className="text-xs text-muted-foreground">Maximum</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(Math.round(max))}</p>
              </div>

              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground">Minimum</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(Math.round(min))}</p>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatNumber}
                />
                <Legend formatter={(value) => (
                  <span style={{ color: '#000000' }}>{value}</span>
                )}/>
                <Tooltip 
                  formatter={(value: number) => [formatNumber(value), 'Prévision']}
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  name="Prévision mensuelle"
                  radius={[8, 8, 0, 0]}
                  fill={COLORS.forecast}
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center mt-2">
              *Prévision basée sur la méthode saisonnière naïve
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}