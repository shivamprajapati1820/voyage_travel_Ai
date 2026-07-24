import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  RefreshCcw,
  Trash2,
  Hotel,
  Landmark,
  UtensilsCrossed,
  Bus,
  Backpack,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { tripService } from "../services/tripService";
import { geocodeService } from "../services/geocodeService";
import MapView from "../components/MapView";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDate, tripDurationLabel } from "../utils/formatters";

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="card">
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
        <Icon size={18} />
      </span>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    </div>
    {children}
  </div>
);

const DayAccordion = ({ day, isOpen, onToggle }) => (
  <div className="overflow-hidden rounded-xl border border-slate-100">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left"
    >
      <span className="font-semibold text-slate-800">
        Day {day.day}
        {day.title ? ` — ${day.title}` : ""}
      </span>
      <ChevronDown
        size={18}
        className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen && (
      <div className="space-y-3 p-4">
        {(day.activities || []).map((activity, idx) => (
          <div key={idx} className="flex gap-3 border-l-2 border-primary-200 pl-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                {activity.time}
              </p>
              <p className="font-medium text-slate-800">{activity.activity}</p>
              {activity.description && (
                <p className="text-sm text-slate-500">{activity.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [openDay, setOpenDay] = useState(1);
  const [markers, setMarkers] = useState([]);

  const loadTrip = async () => {
    setLoading(true);
    try {
      const data = await tripService.getTripById(id);
      setTrip(data);
    } catch (err) {
      toast.error("Trip not found");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Best-effort geocoding of the top attractions so we can plot them on
  // the map alongside the destination marker. Runs once the trip loads.
  useEffect(() => {
    const geocodeAttractions = async () => {
      if (!trip?.aiResponse?.attractions?.length) return;
      const topAttractions = trip.aiResponse.attractions.slice(0, 6);
      const results = [];

      for (const attraction of topAttractions) {
        try {
          const places = await geocodeService.searchPlaces(
            `${attraction.name}, ${trip.destination}`
          );
          if (places[0]) {
            results.push({
              name: attraction.name,
              description: attraction.description,
              lat: places[0].lat,
              lng: places[0].lng,
            });
          }
        } catch {
          // ignore individual geocode failures
        }
      }
      setMarkers(results);
    };

    geocodeAttractions();
  }, [trip]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this trip permanently?")) return;
    try {
      await tripService.deleteTrip(id);
      toast.success("Trip deleted");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to delete trip");
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const updated = await tripService.regenerateTrip(id);
      setTrip(updated);
      toast.success("Itinerary regenerated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Regeneration failed");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading trip details..." />;
  if (!trip) return null;

  const ai = trip.aiResponse;

  return (
    <div className="page-container py-10">
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-2xl bg-cover bg-center p-8 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(6,20,40,0.6), rgba(6,20,40,0.75)), url(https://source.unsplash.com/1200x400/?${encodeURIComponent(
            trip.destination
          )},travel)`,
        }}
      >
        <h1 className="font-display text-3xl font-bold">{trip.destination}</h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-100">
          <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          <span className="flex items-center gap-1"><Users size={14} /> {trip.travelers} traveler(s)</span>
          <span className="flex items-center gap-1"><Wallet size={14} /> ₹{trip.budget}</span>
          <span className="flex items-center gap-1"><MapPin size={14} /> {tripDurationLabel(trip.startDate, trip.endDate)}</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={handleRegenerate} disabled={regenerating} className="btn-secondary !bg-white/10 !text-white !border-white/30 hover:!bg-white/20">
            <RefreshCcw size={16} className={regenerating ? "animate-spin" : ""} />
            {regenerating ? "Regenerating..." : "Regenerate with AI"}
          </button>
          <button onClick={handleDelete} className="btn-secondary !bg-red-500/20 !text-white !border-red-300/30 hover:!bg-red-500/30">
            <Trash2 size={16} /> Delete Trip
          </button>
        </div>
      </div>

      {trip.status === "failed" && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          AI generation failed for this trip. Click "Regenerate with AI" to try again.
        </div>
      )}

      {ai && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Summary */}
            <SectionCard icon={Landmark} title="Trip Summary">
              <p className="text-sm leading-relaxed text-slate-600">{ai.tripSummary}</p>
            </SectionCard>

            {/* Itinerary */}
            <SectionCard icon={Calendar} title="Day-wise Itinerary">
              <div className="space-y-3">
                {(ai.itinerary || []).map((day) => (
                  <DayAccordion
                    key={day.day}
                    day={day}
                    isOpen={openDay === day.day}
                    onToggle={() => setOpenDay(openDay === day.day ? null : day.day)}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Hotels */}
            <SectionCard icon={Hotel} title="Hotel Suggestions">
              <div className="grid gap-4 sm:grid-cols-2">
                {(ai.hotels || []).map((hotel, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 p-4">
                    <p className="font-semibold text-slate-800">{hotel.name}</p>
                    <p className="text-xs text-slate-400">{hotel.area}</p>
                    <p className="mt-2 text-sm text-slate-600">{hotel.description}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="rounded-full bg-primary-50 px-2 py-1 font-medium text-primary-700">
                        {hotel.priceRange}
                      </span>
                      <span className="text-accent-500">★ {hotel.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Attractions */}
            <SectionCard icon={MapPin} title="Tourist Attractions">
              <div className="grid gap-4 sm:grid-cols-2">
                {(ai.attractions || []).map((place, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 p-4">
                    <p className="font-semibold text-slate-800">{place.name}</p>
                    <p className="text-xs font-medium text-primary-600">{place.category}</p>
                    <p className="mt-2 text-sm text-slate-600">{place.description}</p>
                    {place.estimatedTime && (
                      <p className="mt-2 text-xs text-slate-400">⏱ {place.estimatedTime}</p>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Restaurants */}
            <SectionCard icon={UtensilsCrossed} title="Restaurants">
              <div className="grid gap-4 sm:grid-cols-2">
                {(ai.restaurants || []).map((r, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 p-4">
                    <p className="font-semibold text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.cuisine}</p>
                    <p className="mt-2 text-sm text-slate-600">Must try: {r.mustTry}</p>
                    <span className="mt-2 inline-block rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
                      {r.priceRange}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <MapView center={trip.location} markers={markers} height="300px" />

            {/* Budget */}
            <SectionCard icon={Wallet} title="Estimated Budget">
              <ul className="space-y-2 text-sm">
                {ai.estimatedBudget &&
                  Object.entries(ai.estimatedBudget).map(([key, value]) => (
                    <li key={key} className="flex items-center justify-between border-b border-slate-50 pb-2 capitalize">
                      <span className="text-slate-500">{key}</span>
                      <span className={`font-medium ${key === "total" ? "text-primary-700" : "text-slate-700"}`}>
                        {value}
                      </span>
                    </li>
                  ))}
              </ul>
            </SectionCard>

            {/* Transportation */}
            <SectionCard icon={Bus} title="Transportation">
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-medium text-slate-800">Getting there: </span>{ai.transportation?.gettingThere}</p>
                <p><span className="font-medium text-slate-800">Local transport: </span>{ai.transportation?.localTransport}</p>
                <p><span className="font-medium text-slate-800">Tips: </span>{ai.transportation?.tips}</p>
              </div>
            </SectionCard>

            {/* Packing checklist */}
            <SectionCard icon={Backpack} title="Packing Checklist">
              <ul className="space-y-1.5 text-sm text-slate-600">
                {(ai.packingChecklist || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1 accent-primary-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* Travel tips */}
            <SectionCard icon={Lightbulb} title="Travel Tips">
              <ul className="space-y-2 text-sm text-slate-600">
                {(ai.travelTips || []).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
