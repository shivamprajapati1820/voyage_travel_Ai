import { MapPin, Car, Bus, TrainFront, Plane, Flag } from "lucide-react";

const MODE_ICONS = { car: Car, bus: Bus, train: TrainFront, flight: Plane };

/**
 * Horizontal depart -> travel -> arrive timeline for whichever travel
 * option is currently selected.
 */
const TravelTimeline = ({ fromLabel, toLabel, option }) => {
  if (!option) return null;
  const ModeIcon = MODE_ICONS[option.id] || Car;

  return (
    <div className="card">
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Travel Timeline</h3>
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white">
            <MapPin size={18} />
          </span>
          <p className="max-w-[100px] truncate text-xs font-medium text-slate-600 sm:max-w-[140px]">
            {fromLabel}
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex w-full items-center gap-1">
            <span className="h-0.5 flex-1 bg-slate-200" />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white">
              <ModeIcon size={16} />
            </span>
            <span className="h-0.5 flex-1 bg-slate-200" />
          </div>
          <p className="text-xs font-medium text-slate-500">{option.durationLabel} by {option.label}</p>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-700 text-white">
            <Flag size={18} />
          </span>
          <p className="max-w-[100px] truncate text-xs font-medium text-slate-600 sm:max-w-[140px]">
            {toLabel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TravelTimeline;