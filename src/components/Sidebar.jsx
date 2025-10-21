import React from 'react';

export default function Sidebar({ topRegions }) {
  return (
    <aside className="sidebar">
      <h3>Top 3 en tension</h3>
      <div className="top-list">
        {topRegions.map((r, i) => (
          <div key={r.region} className="top-item">
            <div className="rank">{i + 1}</div>
            <div className="meta">
              <div className="name">{r.region}</div>
              <div className="bar">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.round(((r.score_ewm ?? r.tension ?? 0)) * 100)}%` }}
                />
              </div>
              <div className="stats">
                <span>Couv. {r.taux_couverture}%</span>
                <span>Urg. {r.taux_urgences}/100k</span>
                <span>{(r.score_ewm != null ? 'EWM' : 'Tension')} {((r.score_ewm ?? r.tension ?? 0).toFixed(2))}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="note">
        Prototypage: géométries simplifiées. Remplacez le GeoJSON par des
        limites officielles sans changer le code.
      </div>
    </aside>
  );
}

