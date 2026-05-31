import React from "react";
import "../styles/dashboard.css";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  FaLeaf,
  FaShieldAlt,
  FaExclamationTriangle,
  FaListAlt,
} from "react-icons/fa";

function estimateHeight(ndvi) {
  if (ndvi > 0.6) return 15;
  if (ndvi > 0.4) return 9;
  if (ndvi > 0.2) return 3;
  return 1;
}

function calculateRisk(height) {
  const clearance = 8.5;
  if (height > clearance) return "CRITICAL";
  if (height > clearance * 0.8) return "WARNING";
  return "SAFE";
}

function StatsPanel({ points, lines = [] }) {
  let safe = 0;
  let warning = 0;
  let critical = 0;
  let totalNdvi = 0;

  // Height buckets
  let shrubs = 0; // 1m
  let undergrowth = 0; // 3m
  let medCanopy = 0; // 8m
  let highCanopy = 0; // 15m

  points.forEach((p) => {
    const ndvi = p.properties.ndvi;
    totalNdvi += ndvi;

    const height = estimateHeight(ndvi);
    const risk = calculateRisk(height);

    if (risk === "SAFE") safe++;
    else if (risk === "WARNING") warning++;
    else if (risk === "CRITICAL") critical++;

    if (height === 1) shrubs++;
    else if (height === 3) undergrowth++;
    else if (height === 8) medCanopy++;
    else if (height === 15) highCanopy++;
  });

  const avgNdvi =
    points.length > 0 ? (totalNdvi / points.length).toFixed(3) : "0.000";

  // Recharts Data Sets
  const riskData = [
    { name: "Safe", value: safe, color: "#10b981" },
    { name: "Warning", value: warning, color: "#f59e0b" },
    { name: "Critical", value: critical, color: "#ef4444" },
  ];

  const canopyData = [
    { name: "1m Shrubs", count: shrubs },
    { name: "3m Under", count: undergrowth },
    { name: "8m Med", count: medCanopy },
    { name: "15m High", count: highCanopy },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a] border border-slate-700/80 p-2 rounded shadow text-xs">
          <p className="font-semibold text-slate-200">{payload[0].name}</p>
          <p className="text-sky-400 mt-1 font-bold">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="stats">
      {/* 1. RISK RATIO DONUT CHART */}
      <div className="analytics-card">
        <div className="card-header-hud">
          <span className="card-title-hud">Vegetation Risk Ratios</span>
          <FaShieldAlt className="text-slate-400 text-sm" />
        </div>
        <div className="chart-container-inner">
          <ResponsiveContainer width="99%" height={120}>
            <PieChart>
              <Pie
                data={riskData}
                innerRadius={38}
                outerRadius={52}
                paddingAngle={4}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Donut overlay text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[20px] font-black text-white leading-none">
              {((critical / (points.length || 1)) * 100).toFixed(0)}%
            </span>
            <span className="text-[9px] text-[#f43f5e] font-bold uppercase tracking-wider mt-0.5">
              Danger
            </span>
          </div>
        </div>
      </div>

      {/* 2. GRID KPI METRICS BLOCKS */}
      <div className="analytics-card">
        <div className="card-header-hud">
          <span className="card-title-hud">Grid Performance KPIs</span>
          <FaListAlt className="text-slate-400 text-sm" />
        </div>
        <div className="metrics-kpi-grid">
          <div className="kpi-box">
            <div className="kpi-value cyan">{points.length}</div>
            <div className="kpi-label">Checked Nodes</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-value emerald">{avgNdvi}</div>
            <div className="kpi-label">Avg NDVI green</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-value amber">{lines.length}</div>
            <div className="kpi-label">Active Lines</div>
          </div>
          <div className="kpi-box relative overflow-hidden">
            {critical > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
            <div className="kpi-value rose">{critical}</div>
            <div className="kpi-label">Critical Risks</div>
          </div>
        </div>
      </div>

      {/* 3. CANOPY VEGETATION PROFILE BAR CHART */}
      <div className="analytics-card">
        <div className="card-header-hud">
          <span className="card-title-hud">Canopy Height Profiles</span>
          <FaLeaf className="text-slate-400 text-sm" />
        </div>
        <div className="chart-container-inner">
          <ResponsiveContainer width="99%" height={120}>
            <BarChart
              data={canopyData}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 8 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                content={<CustomTooltip />}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                fill="#38bdf8"
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
