import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "../styles/dashboard.css";
import L from "leaflet";
import { renderToString } from "react-dom/server";

function estimateHeight(ndvi) {
  if (ndvi > 0.6) return 15;
  if (ndvi > 0.4) return 8;
  if (ndvi > 0.2) return 3;
  return 1;
}

function calculateRisk(height) {
  const clearance = 8.5;
  if (height > clearance) return "CRITICAL";
  if (height > clearance * 0.8) return "WARNING";
  return "SAFE";
}

// Map Controller for smooth fly-to animations
function MapController({ selectedLine }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLine) {
      const tempLayer = L.geoJSON(selectedLine);
      const bounds = tempLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 13,
          animate: true,
          duration: 1.5,
        });
      }
    }
  }, [selectedLine, map]);

  return null;
}

function MapView({ powerLines, ndviPoints, selectedLine, onSelectLine }) {
  // Center near the geojson data coordinates
  const center = [17.15, 80.05];

  // Dynamic stroke configurations
  const getLineStyle = (feature) => {
    const isSelected =
      selectedLine && selectedLine.properties?.name === feature.properties?.name;

    if (isSelected) {
      return {
        color: "#38bdf8",
        weight: 6,
        opacity: 0.95,
        dashArray: "1, 8",
        lineCap: "round",
        lineJoin: "round",
      };
    }

    const volt = parseInt(feature.properties?.voltage || "0", 10);
    let color = "#0ea5e9"; // Cyan default

    if (volt >= 400) {
      color = "#f43f5e"; // Red alert for massive voltages
    } else if (volt >= 220) {
      color = "#f59e0b"; // Amber for medium high
    }

    return {
      color: color,
      weight: 2.5,
      opacity: 0.6,
      lineCap: "round",
      lineJoin: "round",
    };
  };

  // Transmission line popup interactions
  const onEachLine = (feature, layer) => {
    const volt = feature.properties?.voltage;
    const name = feature.properties?.name;
    const operator = feature.properties?.operator || "State Grid Corporation";

    layer.bindPopup(`
      <div class="popup-container">
        <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">Transmission Asset</h3>
        <div class="popup-row"><span class="popup-label">Grid Segment:</span><span class="popup-value">${name || "Unknown Link"}</span></div>
        <div class="popup-row"><span class="popup-label">Capacity Rating:</span><span class="popup-value">${volt || "N/A"} kV</span></div>
        <div class="popup-row"><span class="popup-label">Operator:</span><span class="popup-value">${operator}</span></div>
      </div>
    `);

    layer.on({
      click: () => {
        onSelectLine(feature);
      },
    });
  };

  // HTML Pulsating divIcon Point Markers
  const pointToLayer = (feature, latlng) => {
    const ndvi = feature.properties.ndvi;
    const height = estimateHeight(ndvi);
    const risk = calculateRisk(height);
    const riskLower = risk.toLowerCase();

    const htmlContent = renderToString(
      <div className="pulsating-marker">
        <div className={`pulsating-halo ${riskLower}`} />
        <div className={`pulsating-core ${riskLower}`} />
      </div>
    );

    const treeIcon = L.divIcon({
      html: htmlContent,
      className: "custom-tree-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = L.marker(latlng, { icon: treeIcon });

    marker.bindPopup(`
      <div class="popup-container">
        <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">Vegetation Monitoring Node</h3>
        <div class="popup-row"><span class="popup-label">Calculated NDVI:</span><span class="popup-value">${ndvi.toFixed(4)}</span></div>
        <div class="popup-row"><span class="popup-label">Est. Canopy Height:</span><span class="popup-value">${height} m</span></div>
        <div class="popup-row"><span class="popup-label">Risk Status:</span><span class="popup-value ${riskLower}">${risk}</span></div>
        <div class="popup-row"><span class="popup-label">Coordinates:</span><span class="popup-value text-slate-400">${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}</span></div>
      </div>
    `);

    return marker;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapContainer
        className="map-view"
        center={center}
        zoom={9}
        zoomControl={false} // Disable standard controls for clean layout
        scrollWheelZoom={true}
      >
        {/* CartoDB Dark Matter base tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Dynamic Zoom fly-to supervisor */}
        <MapController selectedLine={selectedLine} />

        {/* Transmission Lines Layer */}
        <GeoJSON
          key={`lines-${selectedLine?.properties?.name || "base"}`}
          data={powerLines}
          style={getLineStyle}
          onEachFeature={onEachLine}
        />

        {/* NDVI Point Markers Layer */}
        <GeoJSON data={ndviPoints} pointToLayer={pointToLayer} />
      </MapContainer>

      {/* Futuristic Floating GIS Legend HUD overlay */}
      <div className="map-hud-legend">
        <div className="legend-title">Risk Assessment Legend</div>
        <div className="legend-item">
          <span className="legend-dot critical"></span>
          <span>Critical Alert (Canopy &gt; 8.5m)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot warning"></span>
          <span>Warning Warning (Canopy 6.8m - 8.5m)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot safe"></span>
          <span>Safe Environment (Canopy &lt; 6.8m)</span>
        </div>
      </div>
    </div>
  );
}

export default MapView;

