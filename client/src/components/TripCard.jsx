import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Trash2, IndianRupee } from "lucide-react";
import { formatDate, tripDurationLabel } from "../utils/formatters";
import { getLocationImage } from "../utils/imageHelpers";


const statusStyles = {
  generated: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
};

const TripCard = ({ trip, onDelete }) => {
  return (
    <div className="card group flex flex-col overflow-hidden !p-0 transition hover:-translate-y-1">
      <div
        className="h-36 w-full bg-gradient-to-br from-primary-500 to-primary-700 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getLocationImage(trip.destination, 600, 300)})`,
        }}
      >
        <div className="flex h-full w-full items-start justify-between bg-black/20 p-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              statusStyles[trip.status] || statusStyles.draft
            }`}
          >
            {trip.status}
          </span>
          <button
            onClick={() => onDelete(trip._id)}
            className="rounded-full bg-white/90 p-2 text-red-500 opacity-0 transition group-hover:opacity-100"
            title="Delete trip"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-slate-900">
          <MapPin size={18} className="text-primary-600" />
          <h3 className="text-lg font-semibold">{trip.destination}</h3>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {formatDate(trip.startDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee size={14} /> {trip.budget}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs font-medium text-slate-400">
            {tripDurationLabel(trip.startDate, trip.endDate)}
          </span>
          <Link to={`/trips/${trip._id}`} className="text-sm font-semibold text-primary-600 hover:underline">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
