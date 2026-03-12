import React from "react";
import "../styles/dashboard.css";

function PointPopup({ lat, lon, ndvi, height, risk }) {
  return (
    <div>
      <h3>Vegetation Monitoring Point</h3>

      <p>
        <b>NDVI:</b> {ndvi.toFixed(3)}
      </p>

      <p>
        <b>Estimated Height:</b> {height} m
      </p>

      <p>
        <b>Risk Level:</b> {risk}
      </p>

      <p>
        <b>Latitude:</b> {lat}
      </p>

      <p>
        <b>Longitude:</b> {lon}
      </p>
    </div>
  );
}

export default PointPopup;
