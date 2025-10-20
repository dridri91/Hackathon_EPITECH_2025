import { Card } from './ui/card';
import { TrendingUp, Users, AlertTriangle, Package } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground mb-1">{title}</p>
          <h3 className="mb-2">{value}</h3>
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
            <span>{change}</span>
          </div>
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Vaccinations (cette semaine)"
        value="82 450"
        change="+9.3% vs semaine dernière"
        trend="up"
        icon={<Users className="w-6 h-6 text-blue-600" />}
      />
      <StatCard
        title="Taux de couverture national"
        value="63.2%"
        change="+2.1% vs semaine dernière"
        trend="up"
        icon={<TrendingUp className="w-6 h-6 text-green-600" />}
      />
      <StatCard
        title="Passages aux urgences"
        value="14 250"
        change="+12.4% vs semaine dernière"
        trend="up"
        icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
      />
      <StatCard
        title="Stock disponible"
        value="67%"
        change="-5.2% vs semaine dernière"
        trend="down"
        icon={<Package className="w-6 h-6 text-purple-600" />}
      />
    </div>
  );
}
