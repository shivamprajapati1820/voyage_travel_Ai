import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, Compass } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTrips } from "../context/TripContext";
import { tripService } from "../services/tripService";
import TripCard from "../components/TripCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { user } = useAuth();
  const { trips, tripsLoading, fetchTrips, removeTripFromState } = useTrips();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTrips().catch(() => toast.error("Could not load your trips"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await tripService.deleteTrip(id);
      removeTripFromState(id);
      toast.success("Trip deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete trip");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container py-10">
      {/* Welcome header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary-700 to-primary-500 p-8 text-white md:flex-row md:items-center">
        <div>
          <p className="text-primary-100">Welcome back,</p>
          <h1 className="font-display text-3xl font-bold">{user?.name} 👋</h1>
          <p className="mt-2 text-primary-100">
            {trips.length > 0
              ? `You have ${trips.length} saved trip${trips.length > 1 ? "s" : ""}. Ready for the next one?`
              : "You haven't planned a trip yet. Let's create your first one!"}
          </p>
        </div>
        <Link to="/create-trip" className="btn-accent shrink-0 !px-6 !py-3">
          <Plus size={18} /> Create New Trip
        </Link>
      </div>

      {/* Trips grid */}
      <div className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="section-title !text-xl">Your Trips</h2>
        </div>

        {tripsLoading ? (
          <LoadingSpinner fullScreen label="Loading your trips..." />
        ) : trips.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Compass size={28} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">No trips yet</h3>
              <p className="mt-1 text-sm text-slate-500">
                Start planning your first AI-powered adventure.
              </p>
            </div>
            <Link to="/create-trip" className="btn-primary">
              <MapPin size={16} /> Plan a Trip
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div key={trip._id} className={deletingId === trip._id ? "opacity-50" : ""}>
                <TripCard trip={trip} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
