import { useEffect, useState } from "react";
import { geocodeService } from "../services/geocodeService";

/**
 * Requests the browser's Geolocation permission, then reverse-geocodes
 * the coordinates into a city name via Nominatim. Powers the "Smart
 * Nearby Holiday Suggestions" section - the user must grant permission
 * (browsers require this; there is no silent IP-based fallback here).
 *
 * status: "idle" | "requesting" | "granted" | "denied" | "unsupported"
 */
const useGeolocation = () => {
  const [status, setStatus] = useState("idle");
  const [coords, setCoords] = useState(null);
  const [city, setCity] = useState(null);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(point);
        setStatus("granted");

        try {
          const place = await geocodeService.reverseGeocode(point.lat, point.lng);
          setCity(place);
        } catch {
          setCity(null);
        }
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  };

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, coords, city, requestLocation };
};

export default useGeolocation;