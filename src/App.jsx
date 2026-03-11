import React, { useEffect, useState } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import StatsPanel from "./components/StatsPanel";

function App() {
  const [lines, setLines] = useState([]);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    fetch("/power_lines.geojson")
      .then((res) => res.json())
      .then((data) => setLines(data.features));

    fetch("/ndvi_points.geojson")
      .then((res) => res.json())
      .then((data) => setPoints(data.features));
  }, []);

  return (
    <div className="dashboard">
      <Sidebar lines={lines} />

      <div className="main">
        <StatsPanel points={points} />
        <MapView lines={lines} points={points} />
      </div>
    </div>
  );
}

export default App;
