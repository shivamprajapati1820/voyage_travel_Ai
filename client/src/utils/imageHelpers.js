// source.unsplash.com (the old "just put a keyword in the URL" image
// service) was officially deprecated and is no longer reachable. LoremFlickr
// is the closest free, no-API-key replacement - same idea, keyword in the
// URL, real photos back. Used anywhere the app shows a destination's photo.

/** Small deterministic hash so the same destination always gets the same
 *  photo instead of a new random one on every re-render. */
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

/**
 * Builds a location image URL for the given place name.
 * e.g. getLocationImage("Goa, India") -> a stable photo tagged "Goa"
 */
export const getLocationImage = (placeName = "travel", width = 600, height = 300) => {
  const firstSegment = placeName.split(",")[0].trim() || "travel";
  const keywords = firstSegment.split(/\s+/).join(",");
  const lock = hashString(placeName) % 100000;
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(keywords)}?lock=${lock}`;
};