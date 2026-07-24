import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Users, Wallet, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import DestinationAutocomplete from "../components/DestinationAutocomplete";
import MapView from "../components/MapView";
import LoadingSpinner from "../components/LoadingSpinner";
import { TRAVEL_TYPES, INTEREST_OPTIONS } from "../constants/travelOptions";
import { validateTripForm } from "../utils/validators";
import { tripService } from "../services/tripService";
import { useTrips } from "../context/TripContext";

const initialForm = {
  destination: "",
  location: null, // { lat, lng }
  startDate: "",
  endDate: "",
  budget: "",
  travelers: 1,
  travelType: "Solo",
  interests: [],
};

const CreateTrip = () => {
  const navigate = useNavigate();
  const { addTripToState } = useTrips();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDestinationSelect = (place) => {
    setForm((prev) => ({
      ...prev,
      destination: place.displayName,
      location: { lat: place.lat, lng: place.lng },
    }));
  };

  const toggleInterest = (interest) => {
    setForm((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateTripForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);
    try {
      const trip = await tripService.createTrip({
        destination: form.destination,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: Number(form.budget),
        travelers: Number(form.travelers),
        travelType: form.travelType,
        interests: form.interests,
      });

      addTripToState(trip);

      if (trip.status === "generated") {
        toast.success("Your AI itinerary is ready!");
      } else {
        toast.error("Trip saved, but AI generation failed. You can retry from trip details.");
      }

      navigate(`/trips/${trip._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create trip");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="page-container flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <LoadingSpinner size={40} />
        <h2 className="text-xl font-semibold text-slate-800">Crafting your perfect trip...</h2>
        <p className="max-w-sm text-sm text-slate-500">
          Voyage AI is analyzing your preferences and building a personalized itinerary. This can take up to a minute.
        </p>
      </div>
    );
  }

  return (
    <div className="page-container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Sparkles size={22} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-slate-900">Plan a New Trip</h1>
          <p className="mt-1 text-slate-500">Tell us your preferences and let AI build your itinerary.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Destination */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Destination</label>
            <DestinationAutocomplete
              value={form.destination}
              onChange={(val) => setForm((prev) => ({ ...prev, destination: val, location: null }))}
              onSelect={handleDestinationSelect}
              error={errors.destination}
            />
          </div>

          {form.location && (
            <MapView center={form.location} height="260px" zoom={11} />
          )}

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Start Date</label>
              <div className="relative">
                <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.startDate ? "border-red-400" : ""}`}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">End Date</label>
              <div className="relative">
                <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.endDate ? "border-red-400" : ""}`}
                  min={form.startDate || new Date().toISOString().split("T")[0]}
                />
              </div>
              {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          {/* Budget & Travelers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Budget (₹)</label>
              <div className="relative">
                <Wallet size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="e.g. 25000"
                  min={0}
                  className={`input-field pl-10 ${errors.budget ? "border-red-400" : ""}`}
                />
              </div>
              {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Number of Travelers</label>
              <div className="relative">
                <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  name="travelers"
                  value={form.travelers}
                  onChange={handleChange}
                  min={1}
                  className={`input-field pl-10 ${errors.travelers ? "border-red-400" : ""}`}
                />
              </div>
              {errors.travelers && <p className="mt-1 text-xs text-red-500">{errors.travelers}</p>}
            </div>
          </div>

          {/* Travel Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Travel Type</label>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setForm((prev) => ({ ...prev, travelType: type }))}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    form.travelType === type
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    form.interests.includes(interest)
                      ? "border-accent-500 bg-accent-500 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-accent-300"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full !py-3 text-base" disabled={submitting}>
            <Sparkles size={18} /> Generate My Trip with AI
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
