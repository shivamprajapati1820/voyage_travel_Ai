import { MapPin, Clock, Target, Bus, Ruler, Timer } from "lucide-react";

const SUMMARY_ITEMS = [
  { key: "currentLocation", label: "Current Location", icon: MapPin },
  { key: "currentTime", label: "Current Time", icon: Clock },
  { key: "destination", label: "Destination", icon: Target },
  { key: "transport", label: "Transport", icon: Bus },
  { key: "distance", label: "Distance", icon: Ruler },
  { key: "travelDuration", label: "Travel Duration", icon: Timer },
];

/**
 * The 6-field summary grid shown at the top of a generated Smart Time
 * Guide: current location/time, destination, transport, distance, duration.
 */
const TimeGuideSummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid gap-4 rounded-2xl border border-primary-100 bg-primary-50 p-5 sm:grid-cols-2 lg:grid-cols-3">
      {SUMMARY_ITEMS.map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm">
            <Icon size={16} />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-slate-800">{summary[key] || "—"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeGuideSummaryCard;