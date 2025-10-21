// Données intégrées + calcul de l'indice de tension
const data = [
  { region: "Île-de-France", taux_couverture: 52, taux_urgences: 180 },
  { region: "Centre-Val de Loire", taux_couverture: 58, taux_urgences: 140 },
  { region: "Bourgogne-Franche-Comté", taux_couverture: 55, taux_urgences: 160 },
  { region: "Normandie", taux_couverture: 61, taux_urgences: 110 },
  { region: "Hauts-de-France", taux_couverture: 47, taux_urgences: 205 },
  { region: "Grand Est", taux_couverture: 48, taux_urgences: 210 },
  { region: "Pays de la Loire", taux_couverture: 63, taux_urgences: 100 },
  { region: "Bretagne", taux_couverture: 65, taux_urgences: 95 },
  { region: "Nouvelle-Aquitaine", taux_couverture: 59, taux_urgences: 130 },
  { region: "Occitanie", taux_couverture: 57, taux_urgences: 145 },
  { region: "Auvergne-Rhône-Alpes", taux_couverture: 54, taux_urgences: 175 },
  { region: "Provence-Alpes-Côte d’Azur", taux_couverture: 41, taux_urgences: 220 },
  { region: "Corse", taux_couverture: 60, taux_urgences: 120 },
];

const maxUrgences = Math.max(...data.map((d) => d.taux_urgences));
data.forEach((d) => {
  d.tension = (d.taux_urgences / maxUrgences) * (1 - d.taux_couverture / 100);
});

export default data;

