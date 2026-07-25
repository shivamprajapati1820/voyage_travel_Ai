import { useState } from "react";
import { Hotel, UtensilsCrossed, Bus, Ticket, Gift } from "lucide-react";
import { BUDGET_MODES } from "../constants/budgetModes";

/**
 * Renders the 5 budget-tier tabs (Cheapest -> Luxury) and the details
 * panel for whichever tab is active. All 5 tiers already exist in
 * trip.aiResponse.budgetVariants (generated in the same Gemini call as
 * the rest of the itinerary), so switching tabs is instant - no API call.
 */
const BudgetSwitcher = ({ budgetVariants, defaultMode = "standard" }) => {
  const availableModes = BUDGET_MODES.filter((mode) => budgetVariants?.[mode.key]);
  const [activeKey, setActiveKey] = useState(
    budgetVariants?.[defaultMode] ? defaultMode : availableModes[0]?.key
  );

  if (!budgetVariants || availableModes.length === 0) return null;

  const active = budgetVariants[activeKey];

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Instant Budget Switch</h3>
        <span className="text-xs text-slate-400">Same trip, different spend</span>
      </div>

      {/* Tier tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {availableModes.map((mode) => (
          <button
            key={mode.key}
            type="button"
            onClick={() => setActiveKey(mode.key)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeKey === mode.key
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
            }`}
          >
            <span>{mode.emoji}</span>
            {mode.label}
          </button>
        ))}
      </div>

      {active && (
        <div>
          <div className="mb-5 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary-700">{active.totalCost}</span>
            <span className="text-sm text-slate-400">total for this trip</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
              <Hotel size={18} className="mt-0.5 shrink-0 text-primary-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stay</p>
                <p className="text-sm text-slate-700">{active.hotel}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
              <UtensilsCrossed size={18} className="mt-0.5 shrink-0 text-primary-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dining</p>
                <p className="text-sm text-slate-700">{active.restaurant}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
              <Bus size={18} className="mt-0.5 shrink-0 text-primary-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Transport</p>
                <p className="text-sm text-slate-700">{active.transportation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
              <Ticket size={18} className="mt-0.5 shrink-0 text-primary-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Activities</p>
                <p className="text-sm text-slate-700">{active.activities}</p>
              </div>
            </div>
          </div>

          {active.optionalExperiences?.length > 0 && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-accent-50 p-4">
              <Gift size={18} className="mt-0.5 shrink-0 text-accent-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
                  Included Extras
                </p>
                <p className="text-sm text-slate-700">{active.optionalExperiences.join(" • ")}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetSwitcher;