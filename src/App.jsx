import React, { useEffect, useState } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import StatsPanel from "./components/StatsPanel";

function App() {
  const [powerLines, setPowerLines] = useState(null);
  const [ndviPoints, setNdviPoints] = useState(null);

  useEffect(() => {
    fetch("/power_lines.geojson")
      .then((res) => res.json())
      .then((data) => setPowerLines(data));

    fetch("/ndvi_points.geojson")
      .then((res) => res.json())
      .then((data) => setNdviPoints(data));
  }, []);

  if (!powerLines || !ndviPoints) {
    return <div>Loading map data...</div>;
  }

  return (
    <div className="dashboard">
      <Sidebar lines={powerLines.features} />

      <div className="main">
        <StatsPanel points={ndviPoints.features} />

        <MapView powerLines={powerLines} ndviPoints={ndviPoints} />
      </div>
    </div>
  );
}

export default App;
