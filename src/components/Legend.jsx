import React from 'react';

export default function Legend() {
  return (
    <div className="legend">
      <div className="legend-title">Indice de tension</div>
      <div className="legend-gradient" />
      <div className="legend-scale">
        <span>Faible</span>
        <span>Moyenne</span>
        <span>Forte</span>
      </div>
      <div className="legend-subtitle">Taux de vaccination</div>
      <ul className="legend-cats">
        <li>
          <span className="dot dot-excellent" /> ≥ 75% — Excellent
        </li>
        <li>
          <span className="dot dot-moyen" /> 60–74% — Moyen
        </li>
        <li>
          <span className="dot dot-faible" /> 45–59% — Faible
        </li>
        <li>
          <span className="dot dot-tresfaible" /> &lt; 45% — Très faible
        </li>
      </ul>
    </div>
  );
}
