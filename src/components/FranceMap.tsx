import { useState } from 'react';

interface RegionData {
  name: string;
  vaccinationRate: number;
  urgencyVisits: number;
  vaccineStock: number;
  ias: number;
}

interface FranceMapProps {
  onRegionClick: (region: string) => void;
  selectedRegion: string | null;
  regionsData: Record<string, RegionData>;
}

interface RegionPath {
  id: string;
  name: string;
  path: string;
  centerX: number;
  centerY: number;
}

export function FranceMap({ onRegionClick, selectedRegion, regionsData }: FranceMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getRegionColor = (regionId: string) => {
    const data = regionsData[regionId];
    if (!data) return '#e5e7eb';
    
    const rate = data.vaccinationRate;
    if (rate >= 75) return '#10b981'; // Vert - Bon taux
    if (rate >= 60) return '#fbbf24'; // Jaune - Moyen
    if (rate >= 45) return '#f97316'; // Orange - Faible
    return '#ef4444'; // Rouge - Très faible
  };

  // Formes SVG réalistes des régions françaises avec leurs centres pour les boutons
  const regions: RegionPath[] = [
    {
      id: 'bre',
      name: 'Bretagne',
      path: 'M 15,220 L 8,225 L 5,235 L 8,245 L 15,250 L 25,252 L 35,258 L 42,265 L 48,268 L 55,270 L 62,268 L 70,265 L 78,260 L 85,252 L 90,245 L 92,235 L 90,225 L 85,218 L 78,212 L 68,208 L 58,205 L 48,203 L 38,205 L 28,210 L 20,215 Z',
      centerX: 50,
      centerY: 240
    },
    {
      id: 'nor',
      name: 'Normandie',
      path: 'M 85,185 L 78,192 L 72,200 L 70,210 L 72,220 L 78,228 L 88,235 L 98,238 L 108,240 L 118,238 L 128,235 L 138,230 L 145,223 L 150,215 L 152,205 L 150,195 L 145,188 L 138,183 L 128,180 L 118,178 L 108,180 L 98,183 Z',
      centerX: 115,
      centerY: 210
    },
    {
      id: 'hdf',
      name: 'Hauts-de-France',
      path: 'M 145,165 L 140,172 L 138,180 L 140,188 L 145,195 L 152,200 L 160,203 L 170,205 L 180,205 L 190,203 L 200,198 L 208,190 L 212,180 L 212,170 L 208,162 L 200,157 L 190,155 L 180,155 L 170,157 L 160,160 L 152,163 Z',
      centerX: 175,
      centerY: 180
    },
    {
      id: 'idf',
      name: 'Île-de-France',
      path: 'M 155,210 L 152,215 L 152,222 L 155,228 L 160,232 L 167,234 L 175,234 L 182,232 L 187,228 L 190,222 L 190,215 L 187,210 L 182,206 L 175,204 L 167,204 L 160,206 Z',
      centerX: 171,
      centerY: 219
    },
    {
      id: 'ges',
      name: 'Grand Est',
      path: 'M 210,168 L 205,175 L 203,185 L 205,195 L 210,205 L 218,215 L 228,223 L 240,228 L 252,230 L 265,230 L 278,228 L 290,223 L 300,215 L 308,205 L 313,195 L 315,185 L 313,175 L 308,168 L 300,162 L 290,158 L 278,156 L 265,156 L 252,158 L 240,162 L 228,165 Z',
      centerX: 260,
      centerY: 193
    },
    {
      id: 'pdl',
      name: 'Pays de la Loire',
      path: 'M 75,245 L 68,252 L 65,262 L 68,272 L 75,280 L 85,288 L 97,293 L 110,295 L 123,293 L 135,288 L 145,280 L 152,272 L 155,262 L 152,252 L 145,245 L 135,240 L 123,237 L 110,237 L 97,240 L 85,243 Z',
      centerX: 110,
      centerY: 266
    },
    {
      id: 'cvl',
      name: 'Centre-Val de Loire',
      path: 'M 140,220 L 133,228 L 130,238 L 133,250 L 140,262 L 150,272 L 162,278 L 175,280 L 188,278 L 200,272 L 210,262 L 217,250 L 220,238 L 217,228 L 210,220 L 200,214 L 188,211 L 175,210 L 162,212 L 150,216 Z',
      centerX: 175,
      centerY: 245
    },
    {
      id: 'bfc',
      name: 'Bourgogne-Franche-Comté',
      path: 'M 208,225 L 200,235 L 197,248 L 200,262 L 208,275 L 220,286 L 235,293 L 252,297 L 270,298 L 288,295 L 303,288 L 315,278 L 323,265 L 327,250 L 325,235 L 318,223 L 308,215 L 295,210 L 280,208 L 263,208 L 245,212 L 228,218 Z',
      centerX: 262,
      centerY: 253
    },
    {
      id: 'naq',
      name: 'Nouvelle-Aquitaine',
      path: 'M 65,295 L 55,310 L 50,330 L 52,350 L 60,370 L 72,388 L 88,403 L 107,415 L 128,423 L 150,427 L 172,425 L 190,418 L 203,408 L 212,395 L 218,380 L 220,363 L 218,345 L 212,328 L 203,313 L 190,302 L 175,295 L 158,290 L 140,288 L 120,290 L 100,293 L 82,297 Z',
      centerX: 135,
      centerY: 358
    },
    {
      id: 'ara',
      name: 'Auvergne-Rhône-Alpes',
      path: 'M 195,280 L 185,295 L 182,313 L 187,332 L 198,350 L 213,365 L 232,378 L 253,387 L 275,393 L 298,395 L 320,392 L 338,383 L 352,370 L 360,353 L 363,335 L 360,317 L 352,300 L 338,287 L 320,278 L 298,273 L 275,272 L 253,275 L 232,280 L 213,283 Z',
      centerX: 272,
      centerY: 333
    },
    {
      id: 'occ',
      name: 'Occitanie',
      path: 'M 85,430 L 75,445 L 70,463 L 72,482 L 82,500 L 98,515 L 118,527 L 142,535 L 168,539 L 195,538 L 220,532 L 242,522 L 258,508 L 268,490 L 272,470 L 268,450 L 258,433 L 242,420 L 220,412 L 195,408 L 168,408 L 142,412 L 118,418 L 100,425 Z',
      centerX: 171,
      centerY: 473
    },
    {
      id: 'pac',
      name: 'PACA',
      path: 'M 255,405 L 248,418 L 247,433 L 252,448 L 263,462 L 278,473 L 297,480 L 318,484 L 340,485 L 360,482 L 377,474 L 388,462 L 393,447 L 393,432 L 388,418 L 377,407 L 360,400 L 340,397 L 318,397 L 297,400 L 278,404 Z',
      centerX: 320,
      centerY: 441
    },
    {
      id: 'cor',
      name: 'Corse',
      path: 'M 400,500 L 397,510 L 397,522 L 400,535 L 406,547 L 415,556 L 425,562 L 436,564 L 447,562 L 457,556 L 464,545 L 467,533 L 467,520 L 464,508 L 457,498 L 447,491 L 436,488 L 425,488 L 415,491 L 406,495 Z',
      centerX: 432,
      centerY: 526
    }
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 shadow-inner overflow-hidden">
      {/* SVG Map Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 460 580"
          className="w-full h-full max-w-[600px] max-h-[700px]"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
        >
          {/* Fond de mer */}
          <rect x="0" y="0" width="460" height="580" fill="#e0f2fe" className="dark:fill-slate-700" opacity="0.3" />
          
          {/* Régions */}
          {regions.map((region) => {
            const isSelected = selectedRegion === region.id;
            const isHovered = hoveredRegion === region.id;
            const color = getRegionColor(region.id);
            const strokeColor = isSelected ? '#1e40af' : isHovered ? '#3b82f6' : '#64748b';
            const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5;

            return (
              <g key={region.id}>
                {/* Forme de la région */}
                <path
                  d={region.path}
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    opacity: isSelected ? 1 : isHovered ? 0.95 : 0.85,
                    filter: isSelected || isHovered ? 'brightness(1.1)' : 'none',
                  }}
                  onClick={() => onRegionClick(region.id)}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                
                {/* Bouton cliquable au centre de la région */}
                <g
                  className="cursor-pointer"
                  onClick={() => onRegionClick(region.id)}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  {/* Cercle de fond */}
                  <circle
                    cx={region.centerX}
                    cy={region.centerY}
                    r={isSelected ? 16 : isHovered ? 14 : 10}
                    fill="white"
                    stroke={strokeColor}
                    strokeWidth={2}
                    className="transition-all duration-200"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    }}
                  />
                  
                  {/* Marqueur de région */}
                  <g transform={`translate(${region.centerX - 5}, ${region.centerY - 5})`}>
                    <circle
                      cx="5"
                      cy="5"
                      r="3"
                      fill={strokeColor}
                      className="transition-all duration-200"
                    />
                  </g>
                  
                  {/* Label au survol ou sélection */}
                  {(isHovered || isSelected) && (
                    <text
                      x={region.centerX}
                      y={region.centerY + 28}
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        fill: '#1e293b',
                      }}
                    >
                      <tspan
                        x={region.centerX}
                        dy="0"
                        style={{
                          fill: 'white',
                          stroke: '#1e293b',
                          strokeWidth: 3,
                          paintOrder: 'stroke',
                        }}
                      >
                        {region.name}
                      </tspan>
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info bulle au survol */}
      {hoveredRegion && regionsData[hoveredRegion] && (
        <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 min-w-[220px] z-50 pointer-events-none">
          <h4 className="mb-3 text-slate-900 dark:text-slate-100">{regionsData[hoveredRegion].name}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Vaccination:</span>
              <span className="text-slate-900 dark:text-slate-100">{regionsData[hoveredRegion].vaccinationRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">IAS:</span>
              <span className="text-slate-900 dark:text-slate-100">{regionsData[hoveredRegion].ias}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Urgences:</span>
              <span className="text-slate-900 dark:text-slate-100">{regionsData[hoveredRegion].urgencyVisits.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">Cliquez pour plus de détails</p>
        </div>
      )}

      {/* Légende améliorée */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-40">
        <p className="mb-3 text-slate-700 dark:text-slate-300">Taux de vaccination</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded shadow-sm flex-shrink-0" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">≥ 75% - Excellent</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded shadow-sm flex-shrink-0" style={{ backgroundColor: '#fbbf24' }}></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">60-74% - Moyen</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded shadow-sm flex-shrink-0" style={{ backgroundColor: '#f97316' }}></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">45-59% - Faible</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded shadow-sm flex-shrink-0" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">&lt; 45% - Très faible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
