# PrédiVax

PrédiVax est une application web interactive développée en **React**, permettant de **visualiser, filtrer et analyser des données de santé publique à l’échelle des régions françaises.**  
Elle a été conçue dans le cadre d’un projet d’innovation / hackathon autour de l’exploitation des données ouvertes (Open Data).

---

## Fonctionnalités principales

- Carte de France interactive (régions)
  - Survol : affichage instantané des valeurs (taux, indicateurs, etc.)
  - Clic : ouverture d’un panneau de prédictions et d'informations détaillées
- Tableau de bord intelligent
  - Visualisation de séries temporelles
  - Filtrage par indicateur ou par région
  - Import rapide de fichiers CSV
- Tableau de prédiction
  - Modèle utilisé : Seasonal Naive
  - Prédire en détail le nombre des vaccinations saison à venir (oct 2025 à fév 2026)
  - Prédire l'évolution des actes vaccinaux pour l'année à venir
  - Prédire l'évolution des doses vaccinales pour l'année à venir

---

## Technologies utilisées

- React
- TypeScript
- Tailwind CSS
- Vite (pour le build rapide)
- Deck.gl
- React-Map-GL
- math.gl/web-mercator
- D3.js (pour les échelles et la colorimétrie)
- GeoJSON
- Recharts
- PapaParse

---

# Installation et exécution

## Build the Docker image

docker build -t predivax .

## Run the container

docker run -p 8080:80 predivax

## Or use docker-compose

docker-compose up -d

## Stop the container

docker-compose down

## Access

http://localhost:8080
