import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

// Vite doesn't bundle Leaflet's default marker images correctly out of the
// box, so we point the icons at the CDN copies instead of local assets.
const fromIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "hue-rotate-90", // visually distinguish From from To
});

const toIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/** Re-fits the map viewport whenever the route changes. */
const FitBounds = ({ from, to, geometry }) => {
  const map = useMap();

  useEffect(() => {
    const points = geometry?.length ? geometry : [[from.lat, from.lng], [to.lat, to.lng]];
    if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, geometry]);

  return null;
};

/**
 * Shows the From and To points plus the real driving route (if OSRM
 * returned one) as a polyline on an OpenStreetMap base layer.
 */
const RouteMap = ({ from, to, geometry, fromLabel, toLabel, height = "360px" }) => {
  if (!from || !to) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-card" style={{ height }}>
      <MapContainer
        center={[from.lat, from.lng]}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[from.lat, from.lng]} icon={fromIcon}>
          <Popup>From: {fromLabel || "Starting point"}</Popup>
        </Marker>
        <Marker position={[to.lat, to.lng]} icon={toIcon}>
          <Popup>To: {toLabel || "Destination"}</Popup>
        </Marker>

        {geometry?.length > 0 && (
          <Polyline positions={geometry} pathOptions={{ color: "#009dff", weight: 4, opacity: 0.8 }} />
        )}

        <FitBounds from={from} to={to} geometry={geometry} />
      </MapContainer>
    </div>
  );
};

export default RouteMap;