import { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Clock, MapPinOff, RefreshCcw, CalendarDays, Car, TrainFront, Plane } from "lucide-react";
import DestinationAutocomplete from "./DestinationAutocomplete";
import TimeGuideSummaryCard from "./TimeGuideSummaryCard";
import TimeGuideTimeline from "./TimeGuideTimeline";
import LoadingSpinner from "./LoadingSpinner";
import { getCurrentPositionAsync } from "../utils/geolocationPromise";
import { geocodeService } from "../services/geocodeService";
import { routeService } from "../services/routeService";
import { buildTravelOptions } from "../utils/travelEstimates";
import { aiService } from "../services/aiService";

const TRANSPORT_MODES = [
  { id: "car", label: "Car", icon: Car },
  { id: "train", label: "Train", icon: TrainFront },
  { id: "flight", label: "Flight", icon: Plane },
];

const todayISO = () => new Date().toISOString().split("T")[0];

/**
 * "Generate Smart Time Guide" - the premium feature on Trip Details.
 * Flow: resolve location (auto or manual) -> choose departure date & transport
 * mode -> generate a full trip schedule (departure through return). Only
 * runs on explicit button clicks, never automatically.
 */
const SmartTimeGuide = ({ trip }) => {
  const [loading, setLoading] = useState(false);
  const [needsManualCity, setNeedsManualCity] = useState(false);
  const [manualCityText, setManualCityText] = useState("");
  const [manualCityPlace, setManualCityPlace] = useState(null);

  const [locationResolved, setLocationResolved] = useState(false);
  const [coords, setCoords] = useState(null);
  const [cityLabel, setCityLabel] = useState("");

  const defaultTravelDate =
    trip.startDate && trip.startDate.slice(0, 10) >= todayISO() ? trip.startDate.slice(0, 10) : todayISO();
  const [travelChoice, setTravelChoice] = useState("today"); // "today" | "date"
  const [travelDate, setTravelDate] = useState(defaultTravelDate);
  const [transportMode, setTransportMode] = useState(null);

  const [timeGuide, setTimeGuide] = useState(trip.aiResponse?.timeGuide || null);

  const resolveLocation = async () => {
    try {
      const position = await getCurrentPositionAsync();
      const place = await geocodeService.reverseGeocode(position.lat, position.lng);
      setCoords(position);
      setCityLabel(`${place.city}${place.state ? `, ${place.state}` : ""}`);
      setLocationResolved(true);
      setNeedsManualCity(false);
    } catch (err) {
      setNeedsManualCity(true);
    }
  };

  const confirmManualCity = () => {
    if (!manualCityPlace) return;
    setCoords({ lat: manualCityPlace.lat, lng: manualCityPlace.lng });
    setCityLabel(manualCityText);
    setLocationResolved(true);
    setNeedsManualCity(false);
  };

  const handleGenerate = async () => {
    if (!transportMode) {
      toast.error("Please choose a transport mode");
      return;
    }
    if (travelChoice === "date" && !travelDate) {
      toast.error("Please choose a travel date");
      return;
    }

    setLoading(true);
    try {
      let currentDateTime;
      let travelDateISO;

      if (travelChoice === "today") {
        currentDateTime = format(new Date(), "EEEE, dd MMMM yyyy, hh:mm a");
        travelDateISO = todayISO();
      } else {
        const chosen = new Date(`${travelDate}T08:00:00`);
        currentDateTime = format(chosen, "EEEE, dd MMMM yyyy, hh:mm a");
        travelDateISO = travelDate;
      }

      let distanceKm = null;
      let travelDurationLabel = null;
      let finalTransportLabel = TRANSPORT_MODES.find((m) => m.id === transportMode)?.label || "Car";

      if (trip.location?.lat && trip.location?.lng) {
        const drivingRoute = await routeService.getDrivingRoute(coords, trip.location);
        const options = buildTravelOptions(drivingRoute, coords, trip.location);
        const chosenOption = options.find((o) => o.id === transportMode);

        if (chosenOption) {
          distanceKm = chosenOption.distanceKm;
          travelDurationLabel = chosenOption.durationLabel;
        } else {
          // e.g. Flight isn't offered for short distances - fall back gracefully.
          const fallback = options.find((o) => o.isFastest) || options[0];
          if (fallback) {
            distanceKm = fallback.distanceKm;
            travelDurationLabel = fallback.durationLabel;
            finalTransportLabel = fallback.label;
            toast(
              `${TRANSPORT_MODES.find((m) => m.id === transportMode)?.label} isn't practical for this distance - using ${fallback.label} instead.`
            );
          }
        }
      }

      const result = await aiService.generateTimeGuide({
        tripId: trip._id,
        currentCity: cityLabel,
        currentDateTime,
        distanceKm,
        travelDurationLabel,
        transportMode: finalTransportLabel,
        travelDate: travelDateISO,
      });

      setTimeGuide(result);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not generate your Smart Time Guide");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSettings = () => {
    setTimeGuide(null);
  };

  if (loading) {
    return (
      <div className="card flex flex-col items-center gap-3 py-12 text-center">
        <LoadingSpinner size={32} />
        <p className="font-medium text-slate-700">Creating your personalized travel schedule...</p>
        <p className="text-sm text-slate-400">Building your full trip, day by day, start to return</p>
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
            onClick={handleChangeSettings}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            <RefreshCcw size={14} /> Change date / transport
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

  // Step 1: resolve location (auto or manual)
  if (!locationResolved) {
    return (
      <div className="card">
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <Clock size={26} />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Generate Smart Time Guide</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Get a realistic hour-by-hour schedule for your whole trip - from departure to your
              return home.
            </p>
          </div>

          {!needsManualCity && (
            <button onClick={resolveLocation} className="btn-primary">
              <Clock size={16} /> Get Started
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
                onClick={confirmManualCity}
                disabled={!manualCityPlace}
                className="btn-primary mt-3 w-full"
              >
                <Clock size={16} /> Continue
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: choose travel date + transport mode (location already resolved)
  return (
    <div className="card space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Generate Smart Time Guide</h3>
        <p className="text-sm text-slate-500">
          Traveling from <span className="font-medium text-slate-700">{cityLabel}</span>
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">When do you want to start?</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTravelChoice("today")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              travelChoice === "today"
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
            }`}
          >
            Leaving Now
          </button>
          <button
            type="button"
            onClick={() => setTravelChoice("date")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              travelChoice === "date"
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
            }`}
          >
            Choose a Date
          </button>
        </div>

        {travelChoice === "date" && (
          <div className="relative mt-3 max-w-xs">
            <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={travelDate}
              min={todayISO()}
              onChange={(e) => setTravelDate(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">How are you traveling?</label>
        <div className="flex flex-wrap gap-2">
          {TRANSPORT_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setTransportMode(mode.id)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
                transportMode === mode.id
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
              }`}
            >
              <mode.icon size={15} /> {mode.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleGenerate} className="btn-primary w-full">
        <Clock size={16} /> Generate Full Trip Schedule
      </button>
    </div>
  );
};

export default SmartTimeGuide;