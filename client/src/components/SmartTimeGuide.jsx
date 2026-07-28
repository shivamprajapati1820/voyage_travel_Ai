import { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Clock, MapPinOff, RefreshCcw } from "lucide-react";
import DestinationAutocomplete from "./DestinationAutocomplete";
import TimeGuideSummaryCard from "./TimeGuideSummaryCard";
import TimeGuideTimeline from "./TimeGuideTimeline";
import LoadingSpinner from "./LoadingSpinner";
import { getCurrentPositionAsync } from "../utils/geolocationPromise";
import { geocodeService } from "../services/geocodeService";
import { routeService } from "../services/routeService";
import { buildTravelOptions } from "../utils/travelEstimates";
import { aiService } from "../services/aiService";

/**
 * "Generate Smart Time Guide" - the premium feature on Trip Details.
 * Only runs when the button is clicked (never automatically). Reuses:
 * - getCurrentPositionAsync (Browser Geolocation API)
 * - geocodeService.reverseGeocode (Nominatim)
 * - routeService.getDrivingRoute + buildTravelOptions (OSRM)
 * - aiService.generateTimeGuide (Gemini, via the backend)
 * so none of this logic is duplicated elsewhere in the app.
 */
const SmartTimeGuide = ({ trip }) => {
  const [loading, setLoading] = useState(false);
  const [needsManualCity, setNeedsManualCity] = useState(false);
  const [manualCityText, setManualCityText] = useState("");
  const [manualCityPlace, setManualCityPlace] = useState(null);
  const [timeGuide, setTimeGuide] = useState(trip.aiResponse?.timeGuide || null);

  const runGeneration = async (coords, cityLabel) => {
    setLoading(true);
    try {
      const currentDateTime = format(new Date(), "EEEE, dd MMMM yyyy, hh:mm a");

      let distanceKm = null;
      let travelDurationLabel = null;
      let recommendedTransport = null;

      if (trip.location?.lat && trip.location?.lng) {
        const drivingRoute = await routeService.getDrivingRoute(coords, trip.location);
        const options = buildTravelOptions(drivingRoute, coords, trip.location);
        const best = options.find((o) => o.isFastest) || options[0];
        if (best) {
          distanceKm = best.distanceKm;
          travelDurationLabel = best.durationLabel;
          recommendedTransport = best.label;
        }
      }

      const result = await aiService.generateTimeGuide({
        tripId: trip._id,
        currentCity: cityLabel,
        currentDateTime,
        distanceKm,
        travelDurationLabel,
        recommendedTransport,
      });

      setTimeGuide(result);
      setNeedsManualCity(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not generate your Smart Time Guide");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateClick = async () => {
    try {
      const coords = await getCurrentPositionAsync();
      const place = await geocodeService.reverseGeocode(coords.lat, coords.lng);
      const cityLabel = `${place.city}${place.state ? `, ${place.state}` : ""}`;
      await runGeneration(coords, cityLabel);
    } catch (err) {
      setNeedsManualCity(true);
    }
  };

  const handleManualCityConfirm = async () => {
    if (!manualCityPlace) return;
    await runGeneration({ lat: manualCityPlace.lat, lng: manualCityPlace.lng }, manualCityText);
  };

  if (loading) {
    return (
      <div className="card flex flex-col items-center gap-3 py-12 text-center">
        <LoadingSpinner size={32} />
        <p className="font-medium text-slate-700">Creating your personalized travel schedule...</p>
        <p className="text-sm text-slate-400">Fetching your location, route, and building an hour-by-hour plan</p>
      </div>
    );
  }

  if (timeGuide) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <Clock size={20} className="text-primary-600" /> Smart Time Guide
          </h3>
          <button
            onClick={handleGenerateClick}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            <RefreshCcw size={14} /> Regenerate
          </button>
        </div>
        <TimeGuideSummaryCard summary={timeGuide.summary} />
        <TimeGuideTimeline timeline={timeGuide.timeline} />
        {timeGuide.notes?.length > 0 && (
          <div className="card">
            <h4 className="mb-2 text-sm font-semibold text-slate-700">Notes</h4>
            <ul className="space-y-1 text-sm text-slate-500">
              {timeGuide.notes.map((note, idx) => (
                <li key={idx}>• {note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <Clock size={26} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Generate Smart Time Guide</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            Get a realistic hour-by-hour schedule starting from your current location and time,
            all the way to your destination.
          </p>
        </div>

        {!needsManualCity && (
          <button onClick={handleGenerateClick} className="btn-primary">
            <Clock size={16} /> Generate Smart Time Guide
          </button>
        )}

        {needsManualCity && (
          <div className="w-full max-w-sm text-left">
            <p className="mb-2 flex items-center justify-center gap-1.5 text-sm text-amber-600">
              <MapPinOff size={14} /> Location permission denied - enter your city manually
            </p>
            <DestinationAutocomplete
              value={manualCityText}
              onChange={(val) => {
                setManualCityText(val);
                setManualCityPlace(null);
              }}
              onSelect={(place) => {
                setManualCityText(place.displayName);
                setManualCityPlace({ lat: place.lat, lng: place.lng, displayName: place.displayName });
              }}
              placeholder="Enter your current city"
            />
            <button
              onClick={handleManualCityConfirm}
              disabled={!manualCityPlace}
              className="btn-primary mt-3 w-full"
            >
              <Clock size={16} /> Generate with This Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartTimeGuide;