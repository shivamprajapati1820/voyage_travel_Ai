import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Vite doesn't bundle Leaflet's default marker images correctly out of the
// box, so we point the icon at the CDN copies instead of local assets.
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const attractionIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33],
});

/**
 * Renders an OpenStreetMap (via Leaflet) centered on the destination,
 * with an optional list of attraction markers layered on top.
 *
 * center: { lat, lng }
 * markers: [{ name, lat, lng, description }]
 */
const MapView = ({ center, markers = [], zoom = 12, height = "400px" }) => {
  if (!center || !center.lat || !center.lng) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400"
        style={{ height }}
      >
        Select a destination to preview it on the map
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-card" style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[center.lat, center.lng]} icon={defaultIcon}>
          <Popup>Destination</Popup>
        </Marker>

        {markers.map((marker, idx) =>
          marker.lat && marker.lng ? (
            <Marker key={idx} position={[marker.lat, marker.lng]} icon={attractionIcon}>
              <Popup>
                <strong>{marker.name}</strong>
                {marker.description && <p className="mt-1 text-xs">{marker.description}</p>}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
