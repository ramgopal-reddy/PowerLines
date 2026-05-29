import React from "react";
import "../styles/dashboard.css";
import { FaSearch, FaBroadcastTower, FaBolt } from "react-icons/fa";

function Sidebar({
  lines,
  selectedLine,
  onSelectLine,
  searchQuery,
  setSearchQuery,
  voltageFilter,
  setVoltageFilter,
}) {
  const handleItemClick = (line) => {
    // Toggle active state or select
    if (selectedLine && selectedLine.properties?.name === line.properties?.name) {
      onSelectLine(null); // Deselect if already selected
    } else {
      onSelectLine(line);
    }
  };

  const getVoltageClass = (voltage) => {
    const volt = parseInt(voltage || "0", 10);
    if (volt >= 220) return "voltage-badge hv";
    if (volt < 220 && volt > 0) return "voltage-badge mv";
    return "voltage-badge";
  };

  return (
    <div className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-title">
          <FaBroadcastTower className="text-sky-400" />
          <span>VoltGuard GIS</span>
        </div>
        <div className="brand-subtitle">Infrastructure HUD v1.2</div>
      </div>

      {/* Modern Search Field */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Filter transmission lines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Voltage Class Filters */}
      <div className="filter-tabs">
        <div
          className={`filter-tab ${voltageFilter === "All" ? "active" : ""}`}
          onClick={() => setVoltageFilter("All")}
        >
          ALL
        </div>
        <div
          className={`filter-tab ${voltageFilter === "High" ? "active" : ""}`}
          onClick={() => setVoltageFilter("High")}
        >
          ≥ 220kV
        </div>
        <div
          className={`filter-tab ${voltageFilter === "Medium" ? "active" : ""}`}
          onClick={() => setVoltageFilter("Medium")}
        >
          &lt; 220kV
        </div>
      </div>

      {/* Transmission Lines Scroll-list */}
      <ul className="sidebar-list">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-center">
            <FaBolt className="text-slate-600 text-2xl mb-2" />
            <p className="text-xs">No grid lines match your active filters.</p>
          </div>
        ) : (
          lines.map((line, idx) => {
            const isSelected = selectedLine?.properties?.name === line.properties?.name;
            const voltage = line.properties?.voltage || "N/A";
            const name = line.properties?.name || "Unnamed Grid Line";
            const operator = line.properties?.operator || "State Grid Operator";

            return (
              <li
                key={idx}
                className={`sidebar-item ${isSelected ? "active" : ""}`}
                onClick={() => handleItemClick(line)}
              >
                <div className="line-info">
                  <div className="line-name">{name}</div>
                  <div className="line-operator">{operator}</div>
                </div>
                <div className={getVoltageClass(voltage)}>
                  {voltage} kV
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default Sidebar;

