import React from "react";

function PointPopup({ data }) {
  return (
    <div>
      <h3>{data.line}</h3>

      <p>
        <b>NDVI:</b> {data.ndvi}
      </p>

      <p>
        <b>Tree Height:</b> {data.height} m
      </p>

      <p>
        <b>Risk:</b> {data.risk}
      </p>

      <p>
        <b>Lat:</b> {data.lat}
      </p>

      <p>
        <b>Lon:</b> {data.lon}
      </p>
    </div>
  );
}

export default PointPopup;
