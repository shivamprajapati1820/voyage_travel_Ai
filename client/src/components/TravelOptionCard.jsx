import { Car, Bus, TrainFront, Plane, Zap, Wallet, Info } from "lucide-react";

const MODE_ICONS = { car: Car, bus: Bus, train: TrainFront, flight: Plane };

/**
 * One travel-mode card (Car/Bus/Train/Flight) in the Travel Route &
 * Schedule Planner results grid. `isSelected` drives the highlighted
 * border when the user picks a mode to carry into AI trip planning.
 */
const TravelOptionCard = ({ option, isSelected, onSelect }) => {
  const Icon = MODE_ICONS[option.id] || Car;

  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className={`flex flex-col gap-3 rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-card ${
        isSelected ? "border-primary-600 bg-primary-50" : "border-slate-100 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            isSelected ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-600"
          }`}
        >
          <Icon size={20} />
        </span>
        <div className="flex flex-col items-end gap-1">
          {option.isFastest && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              <Zap size={11} /> Fastest
            </span>
          )}
          {option.isCheapest && (
            <span className="flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-semibold text-accent-700">
              <Wallet size={11} /> Most Economical
            </span>
          )}
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-800">{option.label}</h3>

      <div className="space-y-1 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-800">{option.durationLabel}</span> · {option.distanceLabel}
        </p>
        {option.fare && <p className="font-medium text-primary-700">{option.fare} (approx. per person)</p>}
      </div>

      <p className="flex items-start gap-1.5 text-xs text-slate-400">
        <Info size={12} className="mt-0.5 shrink-0" />
        {option.note}
      </p>
    </button>
  );
};

export default TravelOptionCard;