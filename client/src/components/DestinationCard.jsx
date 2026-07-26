import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Clock, Star, Flame, Sparkles } from "lucide-react";
import { weatherService } from "../services/weatherService";
import { estimateTravelTime } from "../utils/geo";
import { getLocationImage } from "../utils/imageHelpers";

/**
 * Destination suggestion card used across the Home page's "Smart Nearby
 * Holiday Suggestions" sections (Weekend Getaways, Long Weekend Escapes,
 * Holiday Specials, Budget Packages, Weather-Based Trips, Recommended).
 *
 * destination: entry from constants/destinationCatalog.js
 * distanceKm: precomputed distance from the user's location (optional -
 *             omitted gracefully if geolocation wasn't granted)
 */
const DestinationCard = ({ destination, distanceKm, isSaved, onToggleSave }) => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let active = true;
    weatherService.getCurrentWeather(destination.lat, destination.lng).then((data) => {
      if (active) setWeather(data);
    });
    return () => {
      active = false;
    };
  }, [destination.lat, destination.lng]);

  const handlePlanWithAI = () => {
    const params = new URLSearchParams({
      destination: `${destination.name}, ${destination.state}`,
      lat: destination.lat,
      lng: destination.lng,
    });
    navigate(`/create-trip?${params.toString()}`);
  };

  return (
    <div className="card group flex flex-col overflow-hidden !p-0 transition hover:-translate-y-1">
      <div
        className="relative h-40 w-full bg-gradient-to-br from-primary-500 to-primary-700 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getLocationImage(destination.name, 500, 300)})`,
        }}
      >
        <div className="flex h-full w-full items-start justify-between bg-black/10 p-3">
          {destination.trending ? (
            <span className="flex items-center gap-1 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white">
              <Flame size={12} /> Trending
            </span>
          ) : (
            <span />
          )}
          <button
            onClick={() => onToggleSave(destination.id)}
            className="rounded-full bg-white/90 p-2 transition hover:scale-105"
            title={isSaved ? "Remove from saved" : "Save destination"}
          >
            <Heart
              size={16}
              className={isSaved ? "fill-red-500 text-red-500" : "text-slate-400"}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-1 text-base font-semibold text-slate-900">
            <MapPin size={15} className="text-primary-600" /> {destination.name}
          </h3>
          <span className="flex items-center gap-1 text-xs font-medium text-accent-500">
            <Star size={13} className="fill-accent-500" /> {destination.rating}
          </span>
        </div>

        <p className="text-xs text-slate-400">{destination.state}</p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          {distanceKm != null && (
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {distanceKm} km
            </span>
          )}
          {distanceKm != null && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {estimateTravelTime(distanceKm)}
            </span>
          )}
          {weather && (
            <span className="flex items-center gap-1">
              {weather.tempC}°C • {weather.label}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-primary-700">
            From ₹{destination.startingPrice.toLocaleString("en-IN")}
          </span>
          <button
            onClick={handlePlanWithAI}
            className="flex items-center gap-1 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
          >
            <Sparkles size={12} /> Plan with AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;