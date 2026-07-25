import { useEffect, useMemo, useState } from "react";
import { LocateFixed, Loader2, MapPinOff, Sunrise, CalendarHeart, Wallet, CloudSun, Sparkles } from "lucide-react";
import useGeolocation from "../hooks/useGeolocation";
import useSavedDestinations from "../hooks/useSavedDestinations";
import { useAuth } from "../context/AuthContext";
import { useTrips } from "../context/TripContext";
import { DESTINATION_CATALOG, INDIA_HOLIDAYS } from "../constants/destinationCatalog";
import { haversineDistanceKm } from "../utils/geo";
import DestinationCard from "./DestinationCard";

const BUDGET_RANGES = [
  { id: "under5k", label: "Under ₹5,000", test: (p) => p < 5000 },
  { id: "5to10k", label: "₹5,000 - ₹10,000", test: (p) => p >= 5000 && p <= 10000 },
  { id: "10to20k", label: "₹10,000 - ₹20,000", test: (p) => p > 10000 && p <= 20000 },
  { id: "over20k", label: "₹20,000+", test: (p) => p > 20000 },
];

const WEATHER_TABS = [
  { id: "sunny", label: "☀️ Sunny Escapes" },
  { id: "snow", label: "❄️ Snow Destinations" },
  { id: "rainy", label: "🌧️ Rainy Getaways" },
  { id: "hill", label: "⛰️ Hill Stations" },
  { id: "beach", label: "🏖️ Beach Holidays" },
];

// Maps a user's stated trip interest to the closest catalog tag, so
// "Recommended For You" can lean on past trip choices even though the
// wording doesn't match 1:1.
const INTEREST_TO_TAG = {
  Beaches: "beach",
  Mountains: "hill",
  Adventure: "adventure",
  "Culture & Heritage": "heritage",
  Nature: "hill",
  "Relaxation & Spa": "beach",
};

/** Finds the next upcoming holiday (wrapping to next year if needed). */
const getNextHoliday = () => {
  const today = new Date();
  const withDates = INDIA_HOLIDAYS.map((h) => {
    let date = new Date(today.getFullYear(), h.month - 1, h.day);
    if (date < today) date = new Date(today.getFullYear() + 1, h.month - 1, h.day);
    return { ...h, date };
  });
  withDates.sort((a, b) => a.date - b.date);
  return withDates[0];
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-5 flex items-center gap-3">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
      <Icon size={20} />
    </span>
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

const CardRow = ({ items, distances, isSaved, onToggleSave }) => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {items.map((dest) => (
      <DestinationCard
        key={dest.id}
        destination={dest}
        distanceKm={distances?.[dest.id] ?? null}
        isSaved={isSaved(dest.id)}
        onToggleSave={onToggleSave}
      />
    ))}
  </div>
);

const NearbySuggestions = () => {
  const { status, coords, city, requestLocation } = useGeolocation();
  const { isSaved, toggleSaved } = useSavedDestinations();
  const { isAuthenticated } = useAuth();
  const { trips, fetchTrips } = useTrips();
  const [budgetFilter, setBudgetFilter] = useState(BUDGET_RANGES[1].id);
  const [weatherTab, setWeatherTab] = useState("beach");

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Distance from the user to every catalog entry, once we have coords.
  const distances = useMemo(() => {
    if (!coords) return {};
    return DESTINATION_CATALOG.reduce((acc, dest) => {
      acc[dest.id] = haversineDistanceKm(coords, { lat: dest.lat, lng: dest.lng });
      return acc;
    }, {});
  }, [coords]);

  const sortedByDistance = useMemo(() => {
    if (!coords) return DESTINATION_CATALOG;
    return [...DESTINATION_CATALOG].sort((a, b) => distances[a.id] - distances[b.id]);
  }, [coords, distances]);

  const weekendGetaways = sortedByDistance.filter((d) => d.tags.includes("weekend")).slice(0, 4);
  const longWeekendEscapes = sortedByDistance
    .filter((d) => d.tags.includes("long-weekend"))
    .slice(0, 4);

  const nextHoliday = useMemo(() => getNextHoliday(), []);
  const holidaySpecials = useMemo(() => {
    const matches = DESTINATION_CATALOG.filter((d) =>
      d.tags.some((tag) => nextHoliday.tags.includes(tag))
    );
    return (matches.length ? matches : DESTINATION_CATALOG.filter((d) => d.trending)).slice(0, 4);
  }, [nextHoliday]);

  const activeBudgetRange = BUDGET_RANGES.find((r) => r.id === budgetFilter);
  const budgetPackages = DESTINATION_CATALOG.filter((d) =>
    activeBudgetRange.test(d.startingPrice)
  ).slice(0, 4);

  const weatherBasedTrips = DESTINATION_CATALOG.filter((d) => d.tags.includes(weatherTab)).slice(
    0,
    4
  );

  const recommendedForYou = useMemo(() => {
    if (!isAuthenticated || trips.length === 0) {
      return DESTINATION_CATALOG.filter((d) => d.trending).slice(0, 4);
    }
    const interestTags = new Set(
      trips.flatMap((t) => t.interests || []).map((i) => INTEREST_TO_TAG[i]).filter(Boolean)
    );
    const matches = DESTINATION_CATALOG.filter((d) => d.tags.some((tag) => interestTags.has(tag)));
    return (matches.length ? matches : DESTINATION_CATALOG.filter((d) => d.trending)).slice(0, 4);
  }, [isAuthenticated, trips]);

  return (
    <div className="page-container space-y-16 py-16">
      {/* Location permission banner */}
      {status !== "granted" && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary-100 bg-primary-50 p-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
              {status === "requesting" ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <LocateFixed size={20} />
              )}
            </span>
            <div>
              <p className="font-semibold text-slate-800">
                {status === "denied" || status === "unsupported"
                  ? "Location unavailable"
                  : "See getaways near you"}
              </p>
              <p className="text-sm text-slate-500">
                {status === "denied"
                  ? "Location was denied - showing popular picks across India instead."
                  : status === "unsupported"
                  ? "Your browser doesn't support geolocation - showing popular picks instead."
                  : "Enable location to get distance, travel time & nearby weekend ideas."}
              </p>
            </div>
          </div>
          {status !== "denied" && status !== "unsupported" && (
            <button onClick={requestLocation} className="btn-primary shrink-0 !px-5 !py-2">
              <MapPinOff size={16} /> Enable Location
            </button>
          )}
        </div>
      )}

      {status === "granted" && city && (
        <p className="-mt-10 text-sm text-slate-500">
          Showing suggestions near <span className="font-medium text-slate-700">{city.city}{city.state ? `, ${city.state}` : ""}</span>
        </p>
      )}

      {/* Weekend Getaways */}
      {weekendGetaways.length > 0 && (
        <section>
          <SectionHeader icon={Sunrise} title="Weekend Getaways" subtitle="Perfect for 1-2 day trips" />
          <CardRow items={weekendGetaways} distances={distances} isSaved={isSaved} onToggleSave={toggleSaved} />
        </section>
      )}

      {/* Long Weekend Escapes */}
      {longWeekendEscapes.length > 0 && (
        <section>
          <SectionHeader icon={Sunrise} title="Long Weekend Escapes" subtitle="Perfect for 3-4 day vacations" />
          <CardRow items={longWeekendEscapes} distances={distances} isSaved={isSaved} onToggleSave={toggleSaved} />
        </section>
      )}

      {/* Holiday Specials */}
      <section>
        <SectionHeader
          icon={CalendarHeart}
          title="Holiday Specials"
          subtitle={`Ideas for ${nextHoliday.name} (${nextHoliday.date.toLocaleDateString("en-IN", { day: "numeric", month: "long" })})`}
        />
        <CardRow items={holidaySpecials} distances={distances} isSaved={isSaved} onToggleSave={toggleSaved} />
      </section>

      {/* Budget Packages */}
      <section>
        <SectionHeader icon={Wallet} title="Budget Packages" subtitle="Filter trips by starting price" />
        <div className="mb-5 flex flex-wrap gap-2">
          {BUDGET_RANGES.map((range) => (
            <button
              key={range.id}
              onClick={() => setBudgetFilter(range.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                budgetFilter === range.id
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        {budgetPackages.length > 0 ? (
          <CardRow items={budgetPackages} distances={distances} isSaved={isSaved} onToggleSave={toggleSaved} />
        ) : (
          <p className="text-sm text-slate-400">No destinations found in this price range yet.</p>
        )}
      </section>

      {/* Weather-Based Trips */}
      <section>
        <SectionHeader icon={CloudSun} title="Weather-Based Trips" subtitle="Recommendations based on climate" />
        <div className="mb-5 flex flex-wrap gap-2">
          {WEATHER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setWeatherTab(tab.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                weatherTab === tab.id
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {weatherBasedTrips.length > 0 ? (
          <CardRow items={weatherBasedTrips} distances={distances} isSaved={isSaved} onToggleSave={toggleSaved} />
        ) : (
          <p className="text-sm text-slate-400">No destinations tagged for this climate yet.</p>
        )}
      </section>

      {/* Recommended For You */}
      <section>
        <SectionHeader
          icon={Sparkles}
          title="Recommended For You"
          subtitle={isAuthenticated ? "Based on your past trips" : "Popular picks to get you started"}
        />
        <CardRow items={recommendedForYou} distances={distances} isSaved={isSaved} onToggleSave={toggleSaved} />
      </section>
    </div>
  );
};

export default NearbySuggestions;