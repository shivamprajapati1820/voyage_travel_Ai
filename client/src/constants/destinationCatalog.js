// Curated destination catalog for the "Smart Nearby Holiday Suggestions"
// feature. This is a static dataset (not live/scraped data) - coordinates
// are used for straight-line distance estimates, startingPrice is a rough
// per-person guide, and `trending` is a manual editorial flag.
// tags: "weekend" (<= 2 day trip friendly), "long-weekend" (3-4 days),
//       plus climate/type tags used for the weather-based filters.

export const DESTINATION_CATALOG = [
  { id: "lonavala", name: "Lonavala", state: "Maharashtra", lat: 18.7546, lng: 73.4062, tags: ["weekend", "hill"], startingPrice: 4500, rating: 4.4, trending: true },
  { id: "alibaug", name: "Alibaug", state: "Maharashtra", lat: 18.6414, lng: 72.8722, tags: ["weekend", "beach"], startingPrice: 5000, rating: 4.3, trending: false },
  { id: "matheran", name: "Matheran", state: "Maharashtra", lat: 18.9873, lng: 73.2698, tags: ["weekend", "hill"], startingPrice: 3800, rating: 4.2, trending: false },
  { id: "igatpuri", name: "Igatpuri", state: "Maharashtra", lat: 19.6969, lng: 73.5626, tags: ["weekend", "hill", "rainy"], startingPrice: 3500, rating: 4.1, trending: false },
  { id: "goa", name: "Goa", state: "Goa", lat: 15.2993, lng: 74.1240, tags: ["long-weekend", "beach", "sunny", "trending"], startingPrice: 8999, rating: 4.8, trending: true },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, tags: ["long-weekend", "heritage", "sunny"], startingPrice: 7500, rating: 4.6, trending: true },
  { id: "udaipur", name: "Udaipur", state: "Rajasthan", lat: 24.5854, lng: 73.7125, tags: ["long-weekend", "heritage"], startingPrice: 9000, rating: 4.7, trending: false },
  { id: "coorg", name: "Coorg", state: "Karnataka", lat: 12.3375, lng: 75.8069, tags: ["long-weekend", "hill", "rainy"], startingPrice: 7000, rating: 4.5, trending: false },
  { id: "pondicherry", name: "Pondicherry", state: "Puducherry", lat: 11.9416, lng: 79.8083, tags: ["long-weekend", "beach"], startingPrice: 6500, rating: 4.4, trending: false },
  { id: "manali", name: "Manali", state: "Himachal Pradesh", lat: 32.2432, lng: 77.1892, tags: ["long-weekend", "hill", "snow"], startingPrice: 8500, rating: 4.6, trending: true },
  { id: "shimla", name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, tags: ["long-weekend", "hill", "snow"], startingPrice: 7800, rating: 4.4, trending: false },
  { id: "rishikesh", name: "Rishikesh", state: "Uttarakhand", lat: 30.0869, lng: 78.2676, tags: ["weekend", "hill", "adventure"], startingPrice: 4200, rating: 4.5, trending: false },
  { id: "munnar", name: "Munnar", state: "Kerala", lat: 10.0889, lng: 77.0595, tags: ["long-weekend", "hill", "rainy"], startingPrice: 7200, rating: 4.6, trending: false },
  { id: "andaman", name: "Andaman Islands", state: "Andaman & Nicobar", lat: 11.7401, lng: 92.6586, tags: ["long-weekend", "beach", "sunny"], startingPrice: 15000, rating: 4.8, trending: true },
];

// Very small static holiday calendar used purely to power "Holiday
// Specials" suggestions - not a live calendar API. Dates are approximate
// national holidays; recurring ones roll to the current/next year at
// render time by the component using this data.
export const INDIA_HOLIDAYS = [
  { name: "Republic Day", month: 1, day: 26, tags: ["heritage", "sunny"] },
  { name: "Holi", month: 3, day: 14, tags: ["hill", "heritage"] },
  { name: "Independence Day", month: 8, day: 15, tags: ["beach", "hill"] },
  { name: "Diwali", month: 11, day: 1, tags: ["heritage", "sunny"] },
  { name: "Christmas", month: 12, day: 25, tags: ["beach", "snow"] },
  { name: "New Year", month: 1, day: 1, tags: ["beach", "trending"] },
];