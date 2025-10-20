import { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

interface RegionData {
  name: string;
  vaccinationRate: number;
  urgencyVisits: number;
  vaccineStock: number;
  ias: number;
}

interface FranceHexMapProps {
  onRegionClick: (region: string) => void;
  selectedRegion: string | null;
  regionsData: Record<string, RegionData>;
  geographyUrl?: string;
}

// Default GeoJSON source served locally by Vite (public/geo/*)
const DEFAULT_GEOJSON = '/geo/regions-2016.geo.json';

// Map region names from GeoJSON to our internal keys
function toKey(name: string): string | null {
  const norm = name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, '')
    .trim();

  const map: Record<string, string> = {
    "ile-de-france": 'idf',
    "hauts-de-france": 'hdf',
    normandie: 'nor',
    bretagne: 'bre',
    "pays de la loire": 'pdl',
    "centre-val de loire": 'cvl',
    "nouvelle-aquitaine": 'naq',
    occitanie: 'occ',
    "auvergne-rhone-alpes": 'ara',
    "provence-alpes-cote d'azur": 'pac',
    "provence-alpes-cote dazur": 'pac',
    "grand est": 'ges',
    "bourgogne-franche-comte": 'bfc',
    corse: 'cor',
  };

  // Collapse multiple spaces and dashes
  const compact = norm.replace(/\s+/g, ' ').replace(/\s*-\s*/g, '-');
  return map[compact] ?? null;
}

export function FranceHexMap({
  onRegionClick,
  selectedRegion,
  regionsData,
  geographyUrl = DEFAULT_GEOJSON,
}: FranceHexMapProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const getRegionColor = (key: string | null) => {
    if (!key) return '#e5e7eb';
    const data = regionsData[key as keyof typeof regionsData];
    if (!data) return '#e5e7eb';
    const rate = data.vaccinationRate;
    if (rate >= 75) return '#10b981';
    if (rate >= 60) return '#fbbf24';
    if (rate >= 45) return '#f97316';
    return '#ef4444';
  };

  // Projection tuned for France mÃ©tropolitaine ("Hexagone")
  const projectionConfig = useMemo(
    () => ({
      center: [2.5, 46.5],
      scale: 2600,
    }),
    []
  );

  const hoveredData = hoveredKey ? regionsData[hoveredKey as keyof typeof regionsData] : null;

  return (
    <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-3">
      <div className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur">
        <ComposableMap
          projection="geoConicConformal"
          projectionConfig={projectionConfig as any}
          width={800}
          height={700}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup minZoom={0.9} maxZoom={6} translateExtent={[[0, 0], [800, 700]]}>
            <Geographies geography={geographyUrl}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => {
                    const name = (geo.properties?.nom || geo.properties?.NAME_1 || '') as string;
                    return !!name;
                  })
                  .map((geo) => {
                    const name = (geo.properties?.nom || geo.properties?.NAME_1 || '') as string;
                    const key = toKey(name);
                    const isSelected = key && selectedRegion === key;
                    const isHovered = key && hoveredKey === key;
                    const color = getRegionColor(key);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={color}
                        stroke={isSelected ? '#1e40af' : isHovered ? '#3b82f6' : '#64748b'}
                        strokeWidth={isSelected ? 2.4 : isHovered ? 2 : 1.2}
                        style={{
                          default: { outline: 'none', transition: 'all 200ms ease' },
                          hover: { outline: 'none', filter: 'brightness(1.06)' },
                          pressed: { outline: 'none' },
                        }}
                        onClick={() => key && onRegionClick(key)}
                        onMouseEnter={() => setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(null)}
                      />
                    );
                  })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Tooltip info */}
      {hoveredKey && hoveredData && (
        <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 min-w-[220px] z-50">
          <h4 className="mb-3 text-slate-900 dark:text-slate-100">{hoveredData.name}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Vaccination</span>
              <span className="text-slate-900 dark:text-slate-100">{hoveredData.vaccinationRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">IAS</span>
              <span className="text-slate-900 dark:text-slate-100">{hoveredData.ias}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Urgences</span>
              <span className="text-slate-900 dark:text-slate-100">{hoveredData.urgencyVisits.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">Cliquez pour sÃ©lectionner</p>
        </div>
      )}

      {/* LÃ©gende */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-4 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-40">
        <p className="mb-2 text-slate-700 dark:text-slate-300 text-sm">Taux de vaccination</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#10b981' }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">â‰¥ 75% - Excellent</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#fbbf24' }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">60â€“74% - Moyen</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#f97316' }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">45â€“59% - Faible</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">&lt; 45% - TrÃ¨s faible</span>
          </div>
        </div>
      </div>
    </div>
  );
}

