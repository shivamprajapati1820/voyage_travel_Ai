import axios from "axios";

// Open-Meteo is a free weather API that needs no API key/signup, so it
// gets its own plain axios instance - separate from our backend and from
// Nominatim.
const weatherClient = axios.create({ baseURL: "https://api.open-meteo.com/v1" });

// Minimal mapping of Open-Meteo's numeric "weather codes" to a short
// human label + condition tag (used by the weather-based filter tabs).
const WEATHER_CODE_MAP = {
  0: { label: "Clear Sky", condition: "sunny" },
  1: { label: "Mostly Clear", condition: "sunny" },
  2: { label: "Partly Cloudy", condition: "sunny" },
  3: { label: "Overcast", condition: "cloudy" },
  45: { label: "Fog", condition: "cloudy" },
  48: { label: "Fog", condition: "cloudy" },
  51: { label: "Light Drizzle", condition: "rainy" },
  61: { label: "Rain", condition: "rainy" },
  63: { label: "Rain", condition: "rainy" },
  65: { label: "Heavy Rain", condition: "rainy" },
  71: { label: "Snow", condition: "snow" },
  73: { label: "Snow", condition: "snow" },
  75: { label: "Heavy Snow", condition: "snow" },
  80: { label: "Rain Showers", condition: "rainy" },
  95: { label: "Thunderstorm", condition: "rainy" },
};

export const weatherService = {
  /**
   * Returns { tempC, label, condition } for the given coordinates,
   * or null if the request fails (weather is a nice-to-have, never
   * something we want to block the UI on).
   */
  getCurrentWeather: async (lat, lng) => {
    try {
      const { data } = await weatherClient.get("/forecast", {
        params: { latitude: lat, longitude: lng, current_weather: true },
      });
      const code = data?.current_weather?.weathercode;
      const meta = WEATHER_CODE_MAP[code] || { label: "—", condition: "sunny" };
      return {
        tempC: Math.round(data?.current_weather?.temperature),
        label: meta.label,
        condition: meta.condition,
      };
    } catch (err) {
      return null;
    }
  },
};