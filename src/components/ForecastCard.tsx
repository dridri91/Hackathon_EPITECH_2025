import { useMemo } from "react";
import type { DataPoint } from "@/lib/seasonalNaive";
import { seasonalNaiveOctToFeb } from "@/lib/seasonalNaive";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForecastCard({ history }: { history: DataPoint[] }) {
  const forecast = useMemo(() => {
    try {
      // Oct 2025 → Feb 2026
      return seasonalNaiveOctToFeb(history, 2025);
    } catch {
      return [];
    }
  }, [history]);

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
          <ul className="space-y-2">
            {forecast.map(f => (
              <li 
                key={f.date}
                className="flex items-center justify-between text-sm border-b pb-2 last:border-0"
              >
                <span className="font-medium tabular-nums text-muted-foreground">
                  {f.date.slice(0,7)}
                </span>
                <span className="font-semibold text-lg">
                  {Math.round(f.value).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}