import React, { useMemo, useState, useEffect } from 'react';
import MapView from './components/MapView.jsx';
import Sidebar from './components/Sidebar.jsx';
import Legend from './components/Legend.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import metrics from './data/metrics.js';
import { computeEWM, withCoverageDelta } from './utils/ewm.js';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [viewKey, setViewKey] = useState(0); // force remount on theme change for map style
  const [scoreMode, setScoreMode] = useState('ewm'); // 'ewm' | 'base'
  const [coverageDelta, setCoverageDelta] = useState(0); // global +points

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const top3 = useMemo(() => {
    const base = withCoverageDelta(metrics, coverageDelta);
    if (scoreMode === 'ewm') {
      const { scores } = computeEWM(base);
      const enriched = base.map((d, i) => ({ ...d, score_ewm: scores[i] }));
      return enriched.sort((a, b) => (b.score_ewm ?? 0) - (a.score_ewm ?? 0)).slice(0, 3);
    }
    // base mode: reuse existing tension metric if present
    return [...base]
      .sort((a, b) => (b.tension ?? 0) - (a.tension ?? 0))
      .slice(0, 3);
  }, [scoreMode, coverageDelta]);

  return (
    <div className="app-shell">
      <div className="map-container">
        <MapView key={viewKey} theme={theme} scoreMode={scoreMode} coverageDelta={coverageDelta} />
        <Legend />
        <div className="ui-top">
          <div className="title">Tension vaccinale – France (3D)</div>
          <div className="mode-toggle">
            <label>
              <span>Score:</span>
              <select value={scoreMode} onChange={(e) => setScoreMode(e.target.value)}>
                <option value="ewm">EWM (poids entropie)</option>
                <option value="base">Basique</option>
              </select>
            </label>
          </div>
          <div className="coverage-delta">
            <label>
              <span>+Couverture (pts): {coverageDelta}</span>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={coverageDelta}
                onChange={(e) => setCoverageDelta(Number(e.target.value))}
              />
            </label>
          </div>
          <ThemeToggle
            theme={theme}
            onToggle={() => {
              setTheme((t) => (t === 'light' ? 'dark' : 'light'));
              setViewKey((k) => k + 1);
            }}
          />
        </div>
      </div>
      <Sidebar topRegions={top3} />
    </div>
  );
}
