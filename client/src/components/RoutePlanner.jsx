import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft, LocateFixed, Route, Sparkles, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import DestinationAutocomplete from "./DestinationAutocomplete";
import RouteMap from "./RouteMap";
import TravelOptionCard from "./TravelOptionCard";
import TravelTimeline from "./TravelTimeline";
import RoutePlannerSkeleton from "./RoutePlannerSkeleton";
import useGeolocation from "../hooks/useGeolocation";
import { routeService } from "../services/routeService";
import { buildTravelOptions } from "../utils/travelEstimates";

/**
 * "Travel Route & Schedule Planner" - lets the user pick a From and To
 * location, see Car/Bus/Train/Flight estimates + a real driving route on
 * the map, then hand the chosen mode off to the existing Create Trip flow.
 * Entirely free/open-source: Browser Geolocation, Nominatim, Leaflet, OSRM.
 */
const RoutePlanner = () => {
  const navigate = useNavigate();
  const { status: geoStatus, coords: geoCoords, city: geoCity } = useGeolocation();

  const [fromText, setFromText] = useState("");
  const [fromPlace, setFromPlace] = useState(null); // { lat, lng }
  const [toText, setToText] = useState("");
  const [toPlace, setToPlace] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState("");

  // Auto-fill the From field once geolocation resolves, but only if the
  // user hasn't already typed something themselves.
  useEffect(() => {
    if (geoStatus === "granted" && geoCoords && !fromPlace) {
      const label = geoCity ? `${geoCity.city}${geoCity.state ? `, ${geoCity.state}` : ""}` : "Current Location";
      setFromText(label);
      setFromPlace(geoCoords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoStatus, geoCoords, geoCity]);

  const handleFindRoutes = async () => {
    if (!fromPlace || !toPlace) {
      setError("Please select both a From and To location from the suggestions list.");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);

    try {
      const drivingRoute = await routeService.getDrivingRoute(fromPlace, toPlace);
      const computedOptions = buildTravelOptions(drivingRoute, fromPlace, toPlace);

      setRouteGeometry(drivingRoute?.geometry || null);
      setOptions(computedOptions);
      setSelectedOption(computedOptions.find((o) => o.isFastest) || computedOptions[0]);
    } catch (err) {
      toast.error("Could not calculate routes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const tempText = fromText;
    const tempPlace = fromPlace;
    setFromText(toText);
    setFromPlace(toPlace);
    setToText(tempText);
    setToPlace(tempPlace);
  };

  const handleContinueWithAI = () => {
    if (!selectedOption || !toPlace) return;
    const params = new URLSearchParams({
      destination: toText,
      lat: toPlace.lat,
      lng: toPlace.lng,
      from: fromText,
      mode: selectedOption.label,
      duration: selectedOption.durationLabel,
    });
    navigate(`/create-trip?${params.toString()}`);
  };

  return (
    <section className="page-container py-16">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Route size={22} />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">Travel Route & Schedule Planner</h2>
          <p className="text-sm text-slate-500">Compare Car, Bus, Train & Flight options between any two places</p>
        </div>
      </div>

      {/* From / To search bar */}
      <div className="card">
        <div className="grid items-start gap-3 md:grid-cols-[1fr_auto_1fr_auto]">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <LocateFixed size={12} /> From
            </label>
            <DestinationAutocomplete
              value={fromText}
              onChange={(val) => {
                setFromText(val);
                setFromPlace(null);
              }}
              onSelect={(place) => {
                setFromText(place.displayName);
                setFromPlace({ lat: place.lat, lng: place.lng });
              }}
              placeholder="Detecting your location..."
            />
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="mt-6 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-primary-300 hover:text-primary-600 md:flex"
            title="Swap From and To"
          >
            <ArrowRightLeft size={16} />
          </button>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">To</label>
            <DestinationAutocomplete
              value={toText}
              onChange={(val) => {
                setToText(val);
                setToPlace(null);
              }}
              onSelect={(place) => {
                setToText(place.displayName);
                setToPlace({ lat: place.lat, lng: place.lng });
              }}
              placeholder="Search any city, state, or destination"
            />
          </div>

          <button onClick={handleFindRoutes} disabled={loading} className="btn-primary mt-6 shrink-0">
            {loading ? "Searching..." : "Find Routes"}
          </button>
        </div>

        {error && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-red-500">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="mt-8">
          <RoutePlannerSkeleton />
        </div>
      )}

      {!loading && searched && options.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {options.map((option) => (
              <TravelOptionCard
                key={option.id}
                option={option}
                isSelected={selectedOption?.id === option.id}
                onSelect={setSelectedOption}
              />
            ))}
          </div>

          <RouteMap
            from={fromPlace}
            to={toPlace}
            geometry={routeGeometry}
            fromLabel={fromText}
            toLabel={toText}
          />

          <TravelTimeline fromLabel={fromText} toLabel={toText} option={selectedOption} />

          <div className="flex flex-col items-center gap-3 rounded-2xl bg-primary-50 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-semibold text-slate-800">Ready to plan the rest of the trip?</p>
              <p className="text-sm text-slate-500">
                We'll carry your route and travel mode into the AI itinerary.
              </p>
            </div>
            <button onClick={handleContinueWithAI} className="btn-primary shrink-0">
              <Sparkles size={16} /> Continue with AI Trip Planning
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default RoutePlanner;