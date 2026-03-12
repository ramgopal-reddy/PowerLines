import React from "react";
import "../styles/dashboard.css";

function estimateHeight(ndvi) {
  if (ndvi > 0.7) return 15;
  if (ndvi > 0.5) return 8;
  if (ndvi > 0.3) return 3;
  return 1;
}

function calculateRisk(height) {
  const clearance = 8.5;

  if (height > clearance) return "CRITICAL";
  if (height > clearance * 0.8) return "WARNING";
  return "SAFE";
}

function StatsPanel({ points }) {
  let safe = 0;
  let warning = 0;
  let critical = 0;

  points.forEach((p) => {
    const height = estimateHeight(p.properties.ndvi);
    const risk = calculateRisk(height);

    if (risk === "SAFE") safe++;
    if (risk === "WARNING") warning++;
    if (risk === "CRITICAL") critical++;
  });

  return (
    <div className="stats">
      <div className="card">
        <h3>Total</h3>
        <p>{points.length}</p>
      </div>

      <div className="card safe">
        <h3>Safe</h3>
        <p>{safe}</p>
      </div>

      <div className="card warning">
        <h3>Warning</h3>
        <p>{warning}</p>
      </div>

      <div className="card critical">
        <h3>Critical</h3>
        <p>{critical}</p>
      </div>
    </div>
  );
}

export default StatsPanel;
