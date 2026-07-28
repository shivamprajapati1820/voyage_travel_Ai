import {
  MapPin,
  LogOut,
  Bus,
  Flag,
  Hotel,
  Coffee,
  UtensilsCrossed,
  Moon,
  Camera,
  BedDouble,
  Circle,
  AlertTriangle,
} from "lucide-react";

const TYPE_ICON = {
  current: MapPin,
  departure: LogOut,
  transit: Bus,
  arrival: Flag,
  checkin: Hotel,
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  dinner: Moon,
  sightseeing: Camera,
  rest: BedDouble,
  other: Circle,
};

const TYPE_COLOR = {
  current: "bg-primary-600",
  departure: "bg-accent-500",
  transit: "bg-accent-500",
  arrival: "bg-primary-700",
  checkin: "bg-primary-600",
  breakfast: "bg-emerald-500",
  lunch: "bg-emerald-500",
  dinner: "bg-emerald-500",
  sightseeing: "bg-primary-500",
  rest: "bg-slate-400",
  other: "bg-slate-400",
};

/**
 * Vertical, icon-led timeline rendering each step of a generated Smart
 * Time Guide - grouped visually by dayLabel, with a callout whenever a
 * step includes an adjustmentNote (moved to a later day, etc).
 */
const TimeGuideTimeline = ({ timeline = [] }) => {
  if (timeline.length === 0) return null;

  let lastDayLabel = null;

  return (
    <div className="card">
      <h3 className="mb-6 text-lg font-semibold text-slate-800">Your Hour-by-Hour Schedule</h3>

      <div className="relative space-y-6 pl-2">
        {timeline.map((step, idx) => {
          const Icon = TYPE_ICON[step.type] || Circle;
          const color = TYPE_COLOR[step.type] || "bg-slate-400";
          const showDayHeader = step.dayLabel && step.dayLabel !== lastDayLabel;
          lastDayLabel = step.dayLabel;

          return (
            <div key={idx}>
              {showDayHeader && (
                <p className="mb-3 mt-2 text-xs font-bold uppercase tracking-wider text-primary-600">
                  {step.dayLabel}
                </p>
              )}
              <div className="relative flex gap-4 pb-1">
                {idx < timeline.length - 1 && (
                  <span className="absolute left-[19px] top-10 h-full w-0.5 bg-slate-100" />
                )}
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${color}`}
                >
                  <Icon size={17} />
                </span>
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold text-slate-800">{step.time}</span>
                    <span className="text-sm font-medium text-slate-600">{step.title}</span>
                  </div>
                  {step.description && (
                    <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                  )}
                  {step.adjustmentNote && (
                    <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                      {step.adjustmentNote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeGuideTimeline;