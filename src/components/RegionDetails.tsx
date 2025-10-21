import { Card } from './ui/card';
import { AlertCircle, TrendingUp, TrendingDown, Package, Activity } from 'lucide-react';
import { Progress } from './ui/progress';

interface RegionData {
  name: string;
  vaccinationRate: number;
  urgencyVisits: number;
  vaccineStock: number;
  ias: number;
}

interface RegionDetailsProps {
  region: RegionData;
}

export function RegionDetails({ region }: RegionDetailsProps) {
  const getVaccinationStatus = (rate: number) => {
    if (rate >= 75) return { text: 'Excellent', color: 'text-green-600' };
    if (rate >= 60) return { text: 'Moyen', color: 'text-yellow-600' };
    if (rate >= 45) return { text: 'Faible', color: 'text-orange-600' };
    return { text: 'Très faible', color: 'text-red-600' };
  };

  const getStockStatus = (stock: number) => {
    if (stock >= 80) return { text: 'Suffisant', color: 'text-green-600', icon: TrendingUp };
    if (stock >= 50) return { text: 'Limité', color: 'text-yellow-600', icon: AlertCircle };
    return { text: 'Critique', color: 'text-red-600', icon: TrendingDown };
  };

  const vaccinationStatus = getVaccinationStatus(region.vaccinationRate);
  const stockStatus = getStockStatus(region.vaccineStock);
  const StockIcon = stockStatus.icon;

  return (
    <Card className="p-6">
      <h3 className="mb-6">{region.name}</h3>
      
      <div className="space-y-6">
        {/* Taux de vaccination */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Taux de vaccination</span>
            <span className={vaccinationStatus.color}>{vaccinationStatus.text}</span>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={region.vaccinationRate} className="flex-1" />
            <span className="min-w-[3rem] text-right">{region.vaccinationRate}%</span>
          </div>
        </div>
        

        {/* IAS - Indicateur Avancé Sanitaire */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">IAS (Indicateur Avancé Sanitaire)</span>
            </div>
            <span>{region.ias}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Niveau d'activité grippale détecté
          </p>
        </div>

        {/* Passages aux urgences */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Passages aux urgences</span>
            </div>
            <span>{region.urgencyVisits.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Nombre de passages cette semaine
          </p>
        </div>

        {/* Stock de vaccins */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Stock de vaccins disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <StockIcon className={`w-4 h-4 ${stockStatus.color}`} />
              <span className={stockStatus.color}>{stockStatus.text}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={region.vaccineStock} className="flex-1" />
            <span className="min-w-[3rem] text-right">{region.vaccineStock}%</span>
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="mb-2 text-blue-900 dark:text-blue-100">Recommandations</h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            {region.vaccinationRate < 60 && (
              <li>• Intensifier les campagnes de vaccination</li>
            )}
            {region.vaccineStock < 50 && (
              <li>• Réapprovisionnement urgent en vaccins nécessaire</li>
            )}
            {region.urgencyVisits > 500 && (
              <li>• Anticiper une hausse des consultations</li>
            )}
            {region.ias > 150 && (
              <li>• Activité grippale élevée - renforcer la surveillance</li>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
}
