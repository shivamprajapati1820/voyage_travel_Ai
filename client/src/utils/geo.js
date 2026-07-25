// Straight-line (haversine) distance + a rough road-travel-time estimate.
// This is NOT real routing data - just a lightweight approximation so
// destination cards can show a distance/duration without a paid Maps API.

const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

export const haversineDistanceKm = (from, to) => {
  if (!from || !to) return null;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c);
};

// Assumes an average road speed of ~55 km/h to turn distance into a
// rough "X hours" travel-time estimate for the card UI.
export const estimateTravelTime = (distanceKm) => {
  if (!distanceKm && distanceKm !== 0) return null;
  const hours = distanceKm / 55;
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${hours.toFixed(1)} hrs`;
};