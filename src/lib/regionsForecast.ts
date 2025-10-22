import Papa from 'papaparse';

export interface RegionData {
  region: string;
  year: number;
  actes: number;
}

export interface RegionForecast extends RegionData {
  isPrediction: boolean;
}

const REGION_CODES: { [key: string]: string } = {
  '11 - ILE-DE-France': 'Île-de-France',
  '24 - CENTRE-VAL-DE-LOIRE': 'Centre-Val de Loire',
  '27 - BOURGOGNE-FRANCHE-COMTE': 'Bourgogne-Franche-Comté',
  '28 - NORMANDIE': 'Normandie',
  '32 - HAUTS-DE-France': 'Hauts-de-France',
  '44 - GRAND-EST': 'Grand Est',
  '52 - PAYS-DE-LA-LOIRE': 'Pays de la Loire',
  '53 - BRETAGNE': 'Bretagne',
  '75 - NOUVELLE-AQUITAINE': 'Nouvelle-Aquitaine',
  '76 - OCCITANIE': 'Occitanie',
  '84 - AUVERGNE-RHONE-ALPES': 'Auvergne-Rhône-Alpes',
  '93 - PROVENCE-ALPES-COTES-D\'AZUR': "Provence-Alpes-Côte d'Azur",
  '94 - CORSE': 'Corse',
};

export async function loadRegionsData(type: string): Promise<RegionForecast[]> {
  return new Promise((resolve, reject) => {
    Papa.parse('/data/regions.csv', {
      download: true,
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          
          // Group by region and year, sum ACTE(VGP) for both age groups
          const grouped = new Map<string, number>();
          
          for (const row of data) {
            if (row.variable === type && row.region && row.Année) {
              const key = `${row.region}|${row.Année}`;
              const value = parseFloat(row.valeur) || 0;
              grouped.set(key, (grouped.get(key) || 0) + value);
            }
          }
          
          // Convert to array with predictions
          const result: RegionForecast[] = [];
          
          for (const [key, actes] of grouped.entries()) {
            const [region, yearStr] = key.split('|');
            const year = parseInt(yearStr);
            
            result.push({
              region: REGION_CODES[region] || region,
              year,
              actes: Math.round(actes),
              isPrediction: false,
            });
          }
          
          // Add 2025 predictions using seasonal naive (average of last 3 years)
          const regionYears = new Map<string, number[]>();
          
          for (const item of result) {
            if (!regionYears.has(item.region)) {
              regionYears.set(item.region, []);
            }
            regionYears.get(item.region)!.push(item.actes);
          }
          
          for (const [region, values] of regionYears.entries()) {
            // Simple average of last 3 years for prediction
            const recent = values.slice(-3);
            const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
            
            result.push({
              region,
              year: 2025,
              actes: Math.round(avg),
              isPrediction: true,
            });
          }
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error),
    });
  });
}