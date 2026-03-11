import React from "react";

function StatsPanel({ points }) {
  const total = points.length;

  const safe = points.filter((p) => p.properties.risk === "SAFE").length;

  const warning = points.filter((p) => p.properties.risk === "WARNING").length;

  const critical = points.filter(
    (p) => p.properties.risk === "CRITICAL",
  ).length;

  return (
    <div className="stats">
      <div className="card">
        <h3>Total Points</h3>
        <p>{total}</p>
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
