import { useState, useEffect } from 'react';
import { FranceHexMap } from './components/FranceHexMap';
import { RegionDetails } from './components/RegionDetails';
import { ForecastSidebar } from './components/ForecastSidebar';
import { DashboardCharts } from './components/DashboardCharts';
import { StatCards } from './components/StatCards';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Activity } from 'lucide-react';
import ForecastCard from './components/ForecastCard';
import Papa from "papaparse";
import RegionalEvolutionCard from './components/RegionalEvolutionCard';
import RegionalDoseEvolutionCard from './components/RegionalDoseEvolutionCard';
// Données mockées pour chaque région
const regionsData = {
  idf: {
    name: 'Île-de-France',
    vaccinationRate: 80,
    urgencyVisits: 3240,
    vaccineStock: 62,
    ias: 198,
  },
  hdf: {
    name: 'Hauts-de-France',
    vaccinationRate: 20,
    urgencyVisits: 1580,
    vaccineStock: 71,
    ias: 156,
  },
  nor: {
    name: 'Normandie',
    vaccinationRate: 50,
    urgencyVisits: 890,
    vaccineStock: 78,
    ias: 142,
  },
  bre: {
    name: 'Bretagne',
    vaccinationRate: 10,
    urgencyVisits: 720,
    vaccineStock: 82,
    ias: 128,
  },
  pdl: {
    name: 'Pays de la Loire',
    vaccinationRate: 45,
    urgencyVisits: 980,
    vaccineStock: 75,
    ias: 138,
  },
  cvl: {
    name: 'Centre-Val de Loire',
    vaccinationRate: 70,
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
	const [history, setHistory] = useState<{date:string; value:number}[] | null>(null);
	const [selectedRegion, setSelectedRegion] = useState<string | null>('idf');

useEffect(() => {
  Papa.parse("/data/vaccinations.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (res) => {
      try {
        const rows = (res.data as any[]).filter(r => r && r.date && r.variable && r.valeur != null);

        // 1) Choisir la métrique à prévoir
        //    -> garde uniquement les lignes "DOSES(J07E1)" (tu peux changer pour "ACTE(VGP)" si tu préfères)
        const metric = "ACTE(VGP)";
        const filtered = rows.filter(r => r.variable === metric);

        // 2) (Optionnel) agréger les groupes (ex: "65 ans et plus" + "moins de 65 ans")
        //    On somme par mois (clé YYYY-MM-01)
        const monthKey = (iso: string) => {
          const d = new Date(iso);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          return `${y}-${m}-01`;
        };

        const byMonth = new Map<string, number>();
        for (const r of filtered) {
          const key = monthKey(String(r.date));
          const val = Number(r.valeur);
          if (!Number.isFinite(val)) continue;
          byMonth.set(key, (byMonth.get(key) ?? 0) + val);
        }

        // 3) Construire l'historique {date,value} trié
        const historyArr = Array.from(byMonth.entries())
          .map(([date, value]) => ({ date, value }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        console.log("History (monthly, summed):", historyArr.slice(0, 6), "…");
        setHistory(historyArr);
      } catch (e) {
        console.error(e);
      }
    },
    error: (err) => console.error(err),
  });
}, []);
	
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
            <TabsTrigger value="analytics">Prédictions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <StatCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <DashboardCharts regionsData={regionsData} />
              </div>
              <div className="max-h-[520px] overflow-auto">
                <ForecastSidebar regionsData={regionsData} />
              </div>
            </div>
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{history ? <ForecastCard history={history} /> : <p>Chargement du CSV…</p>}
							<RegionalEvolutionCard />
							<RegionalDoseEvolutionCard />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

