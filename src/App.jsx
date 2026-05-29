import React, { useEffect, useState } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import StatsPanel from "./components/StatsPanel";
import { FaBolt } from "react-icons/fa";

function App() {
  const [powerLines, setPowerLines] = useState(null);
  const [ndviPoints, setNdviPoints] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [voltageFilter, setVoltageFilter] = useState("All");

  useEffect(() => {
    fetch("/power_lines.geojson")
      .then((res) => res.json())
      .then((data) => setPowerLines(data));

    fetch("/ndvi_points.geojson")
      .then((res) => res.json())
      .then((data) => setNdviPoints(data));
  }, []);

  if (!powerLines || !ndviPoints) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#07090e] text-[#f8fafc]">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-4 border-slate-800 border-t-sky-500 animate-spin"></div>
          <FaBolt className="text-sky-400 text-3xl animate-pulse" />
        </div>
        <p className="mt-6 text-sm font-semibold tracking-wider text-slate-400 uppercase animate-pulse">
          Initializing VoltGuard Geospatial Console...
        </p>
      </div>
    );
  }

  // Filter lines based on search query and voltage criteria
  const filteredLines = powerLines.features.filter((line) => {
    const name = line.properties?.name || "";
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());

    const voltVal = parseInt(line.properties?.voltage || "0", 10);
    let matchesVolt = true;

    if (voltageFilter === "High") {
      matchesVolt = voltVal >= 220;
    } else if (voltageFilter === "Medium") {
      matchesVolt = voltVal < 220 && voltVal > 0;
    }

    return matchesSearch && matchesVolt;
  });

  return (
    <div className="dashboard">
      <Sidebar
        lines={filteredLines}
        selectedLine={selectedLine}
        onSelectLine={setSelectedLine}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        voltageFilter={voltageFilter}
        setVoltageFilter={setVoltageFilter}
      />

      <div className="main">
        {/* Dynamic Header Console HUD */}
        <header className="header-console">
          <div className="console-title">
            <h1 className="tracking-tight">VoltGuard Grid Control</h1>
            <div className="brand-subtitle">Real-time Vegetation Encroachment HUD</div>
          </div>
          <div className="system-status">
            <div className="status-pill">
              <span className="status-indicator"></span>
              Live Grid Feed Active
            </div>
          </div>
        </header>

        {/* Analytics Row using recharts */}
        <StatsPanel points={ndviPoints.features} lines={powerLines.features} />

        {/* Full-width Map View Console */}
        <div className="map-console-wrapper">
          <MapView
            powerLines={powerLines}
            ndviPoints={ndviPoints}
            selectedLine={selectedLine}
            onSelectLine={setSelectedLine}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

