import axios from "axios";

// OSRM's public demo server - free, no API key/signup required. It's a
// shared demo instance (not meant for heavy production traffic), which is
// fine for a college project but worth knowing if this ever needs to scale.
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

const osrmClient = axios.create({ baseURL: OSRM_BASE_URL });

export const routeService = {
  /**
   * Fetches the real driving route between two points from OSRM.
   * Returns { distanceKm, durationMin, geometry } where geometry is an
   * array of [lat, lng] pairs ready to feed into a Leaflet <Polyline>.
   * Returns null if OSRM has no road route between the two points
   * (e.g. across open water) - callers should fall back to straight-line
   * estimates in that case.
   */
  getDrivingRoute: async (from, to) => {
    try {
      const coordString = `${from.lng},${from.lat};${to.lng},${to.lat}`;
      const { data } = await osrmClient.get(`/${coordString}`, {
        params: { overview: "full", geometries: "geojson" },
      });

      const route = data?.routes?.[0];
      if (!route) return null;

      return {
        distanceKm: route.distance / 1000,
        durationMin: route.duration / 60,
        // OSRM returns [lng, lat] pairs; Leaflet wants [lat, lng].
        geometry: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      };
    } catch (err) {
      return null;
    }
  },
};