import React from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "../styles/dashboard.css";

import L from "leaflet";

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

function getColor(risk) {
  if (risk === "CRITICAL") return "red";
  if (risk === "WARNING") return "orange";
  return "green";
}

function MapView({ powerLines, ndviPoints }) {
  const center = [17.36, 80.23];

  // style for transmission lines
  const lineStyle = {
    color: "#0077ff",
    weight: 2,
  };

  // convert NDVI points to markers
  const pointToLayer = (feature, latlng) => {
    const ndvi = feature.properties.ndvi;

    const height = estimateHeight(ndvi);
    const risk = calculateRisk(height);

    const color = getColor(risk);

    const marker = L.circleMarker(latlng, {
      radius: 6,
      fillColor: color,
      color: "white",
      weight: 1,
      fillOpacity: 0.9,
    });

    marker.bindPopup(`
      <b>Vegetation Monitoring Point</b><br/>
      NDVI: ${ndvi.toFixed(3)}<br/>
      Height: ${height} m<br/>
      Risk: ${risk}
    `);

    return marker;
  };

  const lineOfLayer = (feature) => {
    const volt = feature.properties.voltage;

    // const marker = L.circleMarker(latlng, {
    //   radius: 6,
    //   fillColor: color,
    //   color: "white",
    //   weight: 1,
    //   fillOpacity: 0.9,
    // });
    const lineStyle = {
      color: "#0077ff",
      weight: 2,
    };

    lineStyle.bindPopup(`
      <b>Monitoring Line</b><br/>
      Volt: ${volt.toFixed(3)}
    `);
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
      <GeoJSON data={powerLines} style={lineStyle} pointToLayer={lineOfLayer} />

      {/* NDVI Monitoring Points */}
      <GeoJSON data={ndviPoints} pointToLayer={pointToLayer} />
    </MapContainer>
  );
}

export default MapView;
