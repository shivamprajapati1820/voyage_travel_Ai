import axios from "axios";

const NOMINATIM_URL =
  import.meta.env.VITE_NOMINATIM_URL || "https://nominatim.openstreetmap.org";

// Nominatim is a separate public host from our own API, so it needs its
// own plain axios instance (no auth headers, no baseURL override).
const nominatimClient = axios.create({ baseURL: NOMINATIM_URL });

export const geocodeService = {
  /**
   * Returns up to 5 place suggestions for the given free-text query.
   * Used to power the destination autocomplete on the Create Trip form.
   */
  searchPlaces: async (query) => {
    if (!query || query.trim().length < 2) return [];

    const { data } = await nominatimClient.get("/search", {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
    });

    return data.map((place) => ({
      id: place.place_id,
      displayName: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    }));
  },
};
