import { useState } from 'react';
import { FranceHexMap } from './components/FranceHexMap';
import { RegionDetails } from './components/RegionDetails';
import { ForecastSidebar } from './components/ForecastSidebar';
import { DashboardCharts } from './components/DashboardCharts';
import { StatCards } from './components/StatCards';
import { OverviewCharts } from './components/OverviewCharts';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Activity } from 'lucide-react';

// Données mockées pour chaque région (inclut un champ mock "sosMedecins")
const regionsData: Record<string, any> = {
  idf: {
    name: 'Île-de-France',
    vaccinationRate: 68,
    urgencyVisits: 3240,
    sosMedecins: 2100,
    vaccineStock: 62,
    ias: 198,
  },
  hdf: {
    name: 'Hauts-de-France',
    vaccinationRate: 54,
    urgencyVisits: 1580,
    sosMedecins: 980,
    vaccineStock: 71,
    ias: 156,
  },
  nor: {
    name: 'Normandie',
    vaccinationRate: 62,
    urgencyVisits: 890,
    sosMedecins: 540,
    vaccineStock: 78,
    ias: 142,
  },
  bre: {
    name: 'Bretagne',
    vaccinationRate: 70,
    urgencyVisits: 720,
    sosMedecins: 460,
    vaccineStock: 82,
    ias: 128,
  },
  pdl: {
    name: 'Pays de la Loire',
    vaccinationRate: 66,
    urgencyVisits: 980,
    sosMedecins: 620,
    vaccineStock: 75,
    ias: 138,
  },
  cvl: {
    name: 'Centre-Val de Loire',
    vaccinationRate: 59,
    urgencyVisits: 650,
    sosMedecins: 410,
    vaccineStock: 68,
    ias: 145,
  },
  naq: {
    name: 'Nouvelle-Aquitaine',
    vaccinationRate: 61,
    urgencyVisits: 1450,
    sosMedecins: 980,
    vaccineStock: 73,
    ias: 152,
  },
  occ: {
    name: 'Occitanie',
    vaccinationRate: 65,
    urgencyVisits: 1320,
    sosMedecins: 870,
    vaccineStock: 69,
    ias: 167,
  },
  ara: {
    name: 'Auvergne-Rhône-Alpes',
    vaccinationRate: 72,
    urgencyVisits: 1890,
    sosMedecins: 1250,
    vaccineStock: 65,
    ias: 183,
  },
  pac: {
    name: "Provence-Alpes-Côte d'Azur",
    vaccinationRate: 58,
    urgencyVisits: 1560,
    sosMedecins: 1070,
    vaccineStock: 58,
    ias: 189,
  },
  ges: {
    name: 'Grand Est',
    vaccinationRate: 52,
    urgencyVisits: 1240,
    sosMedecins: 820,
    vaccineStock: 76,
    ias: 171,
  },
  bfc: {
    name: 'Bourgogne-Franche-Comté',
    vaccinationRate: 63,
    urgencyVisits: 780,
    sosMedecins: 520,
    vaccineStock: 80,
    ias: 135,
  },
  cor: {
    name: 'Corse',
    vaccinationRate: 56,
    urgencyVisits: 240,
    sosMedecins: 150,
    vaccineStock: 85,
    ias: 112,
  },
};

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>('idf');

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-blue-600">Stratégie Vaccinale Grippe</h1>
              <p className="text-sm text-muted-foreground">
                Optimisation et prédiction des besoins - Hackathon EPITECH
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="map">Carte interactive</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          {/* Overview Tab (charts only) */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewCharts regionsData={regionsData} />
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-4">
                <h3 className="mb-0">Carte des régions françaises</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Cliquez sur une région pour voir les détails
                </p>

                <div className="h-[600px]">
                  <FranceHexMap
                    onRegionClick={handleRegionClick}
                    selectedRegion={selectedRegion}
                    regionsData={regionsData}
                  />
                </div>
              </Card>

              <div>
                {selectedRegion && regionsData[selectedRegion as keyof typeof regionsData] && (
                  <RegionDetails region={regionsData[selectedRegion as keyof typeof regionsData]} />
                )}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab (prévisions) */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <h2 className="mb-4">Analyses prédictives</h2>
                <DashboardCharts regionsData={regionsData} />
              </Card>

              {/* Liste prédictive des régions pour l'année suivante */}
              <ForecastSidebar regionsData={regionsData} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
