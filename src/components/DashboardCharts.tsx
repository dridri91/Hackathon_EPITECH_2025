import { Card } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const vaccinationTrendData = [
  { semaine: 'S40', vaccinations: 45000, objectif: 50000 },
  { semaine: 'S41', vaccinations: 52000, objectif: 55000 },
  { semaine: 'S42', vaccinations: 61000, objectif: 60000 },
  { semaine: 'S43', vaccinations: 68000, objectif: 65000 },
  { semaine: 'S44', vaccinations: 75000, objectif: 70000 },
  { semaine: 'S45', vaccinations: 82000, objectif: 75000 },
];

const urgencyData = [
  { semaine: 'S40', urgences: 1200, sosmedecin: 800 },
  { semaine: 'S41', urgences: 1450, sosmedecin: 950 },
  { semaine: 'S42', urgences: 1680, sosmedecin: 1100 },
  { semaine: 'S43', urgences: 1920, sosmedecin: 1280 },
  { semaine: 'S44', urgences: 2150, sosmedecin: 1450 },
  { semaine: 'S45', urgences: 2400, sosmedecin: 1620 },
];

const regionComparison = [
  { region: 'IDF', taux: 68 },
  { region: 'HDF', taux: 54 },
  { region: 'ARA', taux: 72 },
  { region: 'PACA', taux: 58 },
  { region: 'NAQ', taux: 61 },
  { region: 'OCC', taux: 65 },
  { region: 'GES', taux: 52 },
  { region: 'BRE', taux: 70 },
];

const iasEvolution = [
  { semaine: 'S40', ias: 85 },
  { semaine: 'S41', ias: 102 },
  { semaine: 'S42', ias: 128 },
  { semaine: 'S43', ias: 156 },
  { semaine: 'S44', ias: 189 },
  { semaine: 'S45', ias: 215 },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Évolution des vaccinations */}
      <Card className="p-6">
        <h3 className="mb-4">Évolution des vaccinations</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={vaccinationTrendData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="semaine" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="vaccinations" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Vaccinations réalisées"
            />
            <Line 
              type="monotone" 
              dataKey="objectif" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Objectif"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Passages aux urgences et SOS Médecins */}
      <Card className="p-6">
        <h3 className="mb-4">Passages aux urgences & SOS Médecins</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={urgencyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="semaine" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip />
            <Legend />
            <Bar dataKey="urgences" fill="#ef4444" name="Urgences" />
            <Bar dataKey="sosmedecin" fill="#f97316" name="SOS Médecins" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Comparaison régionale */}
      <Card className="p-6">
        <h3 className="mb-4">Taux de vaccination par région</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={regionComparison} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" domain={[0, 100]} className="text-sm" />
            <YAxis dataKey="region" type="category" className="text-sm" />
            <Tooltip />
            <Bar dataKey="taux" fill="#3b82f6" name="Taux de vaccination (%)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* IAS Evolution */}
      <Card className="p-6">
        <h3 className="mb-4">Indicateur Avancé Sanitaire (IAS)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={iasEvolution}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="semaine" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="ias" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.3}
              name="IAS"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-2">
          Tendance haussière - Activité grippale en augmentation
        </p>
      </Card>
    </div>
  );
}
