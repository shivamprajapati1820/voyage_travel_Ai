/**
 * One-shot, awaitable wrapper around the Browser Geolocation API.
 * Used by features that request location on a button click (like the
 * Smart Time Guide) rather than automatically on page load - the
 * existing useGeolocation hook auto-requests on mount, which isn't
 * appropriate here since generation should only start when the user
 * clicks the button.
 */
export const getCurrentPositionAsync = () => {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  });
};