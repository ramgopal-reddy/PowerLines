import React from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import PointPopup from "./PointPopup";

const { BaseLayer, Overlay } = LayersControl;

function getColor(risk) {
  if (risk === "CRITICAL") return "red";
  if (risk === "WARNING") return "orange";
  return "green";
}

function createIcon(color) {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="
      background:${color};
      width:12px;
      height:12px;
      border-radius:50%;
      border:2px solid white
    "></div>`,
  });
}

function MapView({ lines, points, selectedLine }) {
  const center = [17.36, 80.23];

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: "600px", width: "100%" }}
    >
      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution="&copy; OSM"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        <Overlay checked name="Transmission Lines">
          <GeoJSON
            data={lines}
            style={{
              color: "#0077ff",
              weight: 3,
            }}
          />
        </Overlay>

        <Overlay checked name="Vegetation Monitoring Points">
          <>
            {points.map((p, idx) => {
              const [lon, lat] = p.geometry.coordinates;

              return (
                <Marker
                  position={[lat, lon]}
                  icon={createIcon(getColor(p.properties.risk))}
                >
                  <Popup>
                    <PointPopup data={p.properties} />
                  </Popup>
                </Marker>
              );
            })}
          </>
        </Overlay>
      </LayersControl>
    </MapContainer>
  );
}

export default MapView;
