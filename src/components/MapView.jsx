import React, { useEffect, useMemo, useState, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import Map from 'react-map-gl';
import { WebMercatorViewport, fitBounds } from '@math.gl/web-mercator';
import { scaleSequential } from 'd3-scale';
import { interpolateRdYlGn } from 'd3-scale-chromatic';
import regions from '../data/regions.geojson?url';
import rawMetrics from '../data/metrics.js';
import { computeEWM, withCoverageDelta } from '../utils/ewm.js';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

function hexToRgbArray(hex) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function colorToRgbArray(color) {
  // color is rgb string like rgb(255,0,0) or hex
  if (color.startsWith('#')) return hexToRgbArray(color);
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return [200, 200, 200];
}

function normalizeName(str) {
  if (!str) return '';
  // unify quotes, remove diacritics, collapse spaces/hyphens, lowercase
  return str
    .replace(/[’']/g, "'")
    .normalize('NFD').replace(/\p{Diacritic}+/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getFeatureBounds(feature) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const coords = feature.geometry.coordinates;
  const walk = (arr) => {
    if (typeof arr[0] === 'number') {
      const [x, y] = arr;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    } else {
      arr.forEach(walk);
    }
  };
  walk(coords);
  return [
    [minX, minY],
    [maxX, maxY],
  ];
}

export default function MapView({ theme, scoreMode = 'ewm', coverageDelta = 0 }) {
  const [data, setData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 2.3,
    latitude: 46.6,
    zoom: 5.2,
    pitch: 50,
    bearing: -10,
  });

  useEffect(() => {
    // Initial friendly fly-in
    const t = setTimeout(() => {
      setViewState((v) => ({ ...v, zoom: 5.2 }));
    }, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Load regions GeoJSON and merge metrics
    fetch(regions)
      .then((r) => r.json())
      .then((geo) => {
        const baseMetrics = withCoverageDelta(rawMetrics, coverageDelta);
        const metricsMap = new globalThis.Map(
          baseMetrics.map((d) => [normalizeName(d.region), d])
        );

        const metroSet = new Set([
          'ile-de-france',
          'centre-val de loire',
          'bourgogne-franche-comte',
          'normandie',
          'hauts-de-france',
          'grand est',
          'pays de la loire',
          'bretagne',
          'nouvelle-aquitaine',
          'occitanie',
          'auvergne-rhone-alpes',
          "provence-alpes-cote d'azur",
          'corse',
        ]);
        const mergedBare = geo.features
          .filter((f) => {
            const nm = normalizeName(
              f.properties?.region || f.properties?.nom || f.properties?.name
            );
            return metroSet.has(nm);
          })
          .map((f) => {
            const name = f.properties?.region || f.properties?.nom || f.properties?.name;
            const m = metricsMap.get(normalizeName(name));
            return {
              ...f,
              properties: {
                ...f.properties,
                ...(m || {}),
              },
            };
          });

        // Compute EWM score dynamically if requested
        let features = mergedBare;
        if (scoreMode === 'ewm') {
          const rows = features.map((f) => ({
            taux_urgences: f.properties.taux_urgences,
            taux_couverture: f.properties.taux_couverture,
          }));
          const { scores } = computeEWM(rows);
          features = features.map((f, i) => ({
            ...f,
            properties: {
              ...f.properties,
              score_ewm: scores[i],
            },
          }));
        }

        const merged = { ...geo, features };
        setData(merged);
      });
  }, [coverageDelta, scoreMode]);

  const colorScale = useMemo(() =>
    scaleSequential((t) => interpolateRdYlGn(1 - t)).domain([0, 1])
  , []);

  const geoLayer = useMemo(() => {
    if (!data) return null;
    return new GeoJsonLayer({
      id: 'regions-geojson',
      data,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      wireframe: false,
      getElevation: (f) => {
        const s = scoreMode === 'ewm' ? (f.properties?.score_ewm ?? 0) : (f.properties?.tension ?? 0);
        return s * 8000;
      },
      getFillColor: (f) => {
        const s = scoreMode === 'ewm' ? (f.properties?.score_ewm ?? 0) : (f.properties?.tension ?? 0);
        return colorToRgbArray(colorScale(s));
      },
      getLineColor: [40, 40, 40],
      lineWidthUnits: 'pixels',
      getLineWidth: 1,
      onHover: (info) => setHoverInfo(info && info.object ? info : null),
      onClick: ({ object }) => {
        if (!object) return;
        const b = getFeatureBounds(object);
        const { width, height } = window.visualViewport || { width: 1200, height: 800 };
        const { longitude, latitude, zoom } = new WebMercatorViewport({
          width,
          height,
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
        }).fitBounds(b, { padding: 40 });
        setViewState((v) => ({ ...v, longitude, latitude, zoom }));
      },
      transitions: {
        getFillColor: 500,
        getElevation: 700,
      },
    });
  }, [data, colorScale, viewState.longitude, viewState.latitude, viewState.zoom]);

  const mapStyle = theme === 'dark'
    ? 'mapbox://styles/mapbox/dark-v11'
    : 'mapbox://styles/mapbox/light-v11';

  return (
    <div className="map-wrap">
      <DeckGL
        layers={[geoLayer].filter(Boolean)}
        initialViewState={{ ...viewState, zoom: 6.2 }}
        viewState={viewState}
        controller={{ dragRotate: true, touchRotate: true }}
        onViewStateChange={({ viewState: vs }) => setViewState(vs)}
        getTooltip={({ object }) => {
          if (!object) return null;
          const p = object.properties || {};
          const val = (scoreMode === 'ewm' ? (p.score_ewm ?? 0) : (p.tension ?? 0)).toFixed(2);
          return {
            html: `
              <div class="tooltip">
                <div class="tt-title">${p.region || p.nom}</div>
                <div>Couverture: <b>${p.taux_couverture ?? '–'}%</b></div>
                <div>Urgences: <b>${p.taux_urgences ?? '–'}</b> / 100k</div>
                <div>${scoreMode === 'ewm' ? 'Score EWM' : 'Tension'}: <b>${val}</b></div>
              </div>
            `,
          };
        }}
      >
        <Map reuseMaps mapStyle={mapStyle} mapboxAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
    </div>
  );
}
