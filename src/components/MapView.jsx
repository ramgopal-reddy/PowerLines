import React from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "../styles/dashboard.css";
import L from "leaflet";

import { FaTree } from "react-icons/fa";
import { renderToString } from "react-dom/server";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";

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

function getColor(risk) {
  if (risk === "CRITICAL") return "red";
  if (risk === "WARNING") return "orange";
  return "green";
}

function MapView({ powerLines, ndviPoints }) {
  const center = [17.36, 80.23];

  // ---------- POWER LINE STYLE ----------
  const lineStyle = {
    color: "#0077ff",
    weight: 2,
  };

  // ---------- POWER LINE POPUP ----------
  const onEachLine = (feature, layer) => {
    const volt = feature.properties?.voltage;
    const name = feature.properties?.name;

    layer.bindPopup(`
      <b>Transmission Line</b><br/>
      Name: ${name || "Unknown"}<br/>
      Voltage: ${volt || "N/A"} kV
    `);
  };

  // ---------- NDVI POINTS ----------
  const pointToLayer = (feature, latlng) => {
    const ndvi = feature.properties.ndvi;

    const height = estimateHeight(ndvi);
    const risk = calculateRisk(height);

    const color = getColor(risk);

    //---------- circleMarker Change required ----------

    // const marker = L.circleMarker(latlng, {
    //   radius: 6,
    //   fillColor: color,
    //   color: "white",
    //   weight: 1,
    //   fillOpacity: 0.9,
    // });

    const treeIcon = L.divIcon({
      html: renderToString(<FaTree color={color} size={16} />),
      className: "custom-tree-icon",
      iconSize: [10, 10],
    });

    const marker = L.marker(latlng, {
      icon: treeIcon,
    });

    // -------------------------------------------------

    marker.bindPopup(`
      <b>Vegetation Monitoring Point</b><br/>
      NDVI: ${ndvi.toFixed(3)}<br/>
      Height: ${height} m<br/>
      Risk: ${risk}
    `);

    return marker;
  };

  return (
    <MapContainer
      className="map-view"
      center={center}
      zoom={9}
      style={{ height: "600px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Transmission Lines */}
      <GeoJSON data={powerLines} style={lineStyle} onEachFeature={onEachLine} />

      {/* NDVI Points */}
      <GeoJSON data={ndviPoints} pointToLayer={pointToLayer} />
    </MapContainer>
  );
}

export default MapView;
