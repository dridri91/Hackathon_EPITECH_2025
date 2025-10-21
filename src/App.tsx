import { useState } from 'react';
import { FranceHexMap } from './components/FranceHexMap';
import { RegionDetails } from './components/RegionDetails';
import { DashboardCharts } from './components/DashboardCharts';
import { StatCards } from './components/StatCards';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Activity } from 'lucide-react';

// Données mockées pour chaque région
const regionsData = {
  idf: {
    name: 'Île-de-France',
    vaccinationRate: 68,
    urgencyVisits: 3240,
    vaccineStock: 62,
    ias: 198,
  },
  hdf: {
    name: 'Hauts-de-France',
    vaccinationRate: 54,
    urgencyVisits: 1580,
    vaccineStock: 71,
    ias: 156,
  },
  nor: {
    name: 'Normandie',
    vaccinationRate: 62,
    urgencyVisits: 890,
    vaccineStock: 78,
    ias: 142,
  },
  bre: {
    name: 'Bretagne',
    vaccinationRate: 70,
    urgencyVisits: 720,
    vaccineStock: 82,
    ias: 128,
  },
  pdl: {
    name: 'Pays de la Loire',
    vaccinationRate: 66,
    urgencyVisits: 980,
    vaccineStock: 75,
    ias: 138,
  },
  cvl: {
    name: 'Centre-Val de Loire',
    vaccinationRate: 59,
    urgencyVisits: 650,
    vaccineStock: 68,
    ias: 145,
  },
  naq: {
    name: 'Nouvelle-Aquitaine',
    vaccinationRate: 61,
    urgencyVisits: 1450,
    vaccineStock: 73,
    ias: 152,
  },
  occ: {
    name: 'Occitanie',
    vaccinationRate: 65,
    urgencyVisits: 1320,
    vaccineStock: 69,
    ias: 167,
  },
  ara: {
    name: 'Auvergne-Rhône-Alpes',
    vaccinationRate: 72,
    urgencyVisits: 1890,
    vaccineStock: 65,
    ias: 183,
  },
  pac: {
    name: "Provence-Alpes-Côte d'Azur",
    vaccinationRate: 58,
    urgencyVisits: 1560,
    vaccineStock: 58,
    ias: 189,
  },
  ges: {
    name: 'Grand Est',
    vaccinationRate: 52,
    urgencyVisits: 1240,
    vaccineStock: 76,
    ias: 171,
  },
  bfc: {
    name: 'Bourgogne-Franche-Comté',
    vaccinationRate: 63,
    urgencyVisits: 780,
    vaccineStock: 80,
    ias: 135,
  },
  cor: {
    name: 'Corse',
    vaccinationRate: 56,
    urgencyVisits: 240,
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <StatCards />
            <DashboardCharts />
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <h2 className="mb-2">Carte des régions françaises</h2>
                <p className="text-sm text-muted-foreground mb-3">
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <h2 className="mb-4">Analyses prédictives</h2>
                <DashboardCharts />
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Zones prioritaires</h3>
                <div className="space-y-4">
                  {Object.entries(regionsData)
                    .sort((a, b) => a[1].vaccinationRate - b[1].vaccinationRate)
                    .slice(0, 5)
                    .map(([id, region]) => (
                      <div
                        key={id}
                        className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                        onClick={() => {
                          setSelectedRegion(id);
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span>{region.name}</span>
                          <span className="text-red-600">{region.vaccinationRate}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Taux de vaccination faible - Action requise
                        </p>
                      </div>
                    ))}
                </div>

                <h3 className="mt-8 mb-4">Recommandations générales</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p>
                      <strong>Grand Est & Hauts-de-France:</strong> Renforcer les campagnes de
                      sensibilisation
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p>
                      <strong>PACA & IDF:</strong> Anticiper la hausse des passages aux urgences
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p>
                      <strong>Toutes régions:</strong> Optimiser la distribution des vaccins en
                      pharmacie
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

