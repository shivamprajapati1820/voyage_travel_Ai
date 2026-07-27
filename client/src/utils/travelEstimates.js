import { haversineDistanceKm } from "./geo";

// No free API gives real-time train/bus/flight schedules or fares in India,
// so these are ESTIMATES built from average speeds and rough per-km rates -
// clearly labeled as such in the UI. Car uses OSRM's real driving
// distance/duration when available (accurate); the rest are heuristics.
// Swap these formulas out for a real transport API later without touching
// any UI code - everything downstream just consumes the shape this returns.

const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return "—";
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
};

const formatFare = (amount) => {
  if (!amount) return null;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

/**
 * Builds the 4 travel mode cards for a From -> To trip.
 *
 * drivingRoute: result of routeService.getDrivingRoute (may be null if
 *               OSRM couldn't find a road route)
 * from/to: { lat, lng }
 */
export const buildTravelOptions = (drivingRoute, from, to) => {
  const straightLineKm = haversineDistanceKm(from, to) || 0;
  const roadKm = drivingRoute?.distanceKm || straightLineKm * 1.25; // rough road-vs-straight-line padding
  const roadDurationMin = drivingRoute?.durationMin || (roadKm / 55) * 60;

  const options = [];

  // --- Car: real OSRM data when available ---
  options.push({
    id: "car",
    label: "Car",
    distanceKm: roadKm,
    durationMin: roadDurationMin,
    fare: formatFare(roadKm * 8), // rough fuel + toll estimate
    isLiveData: !!drivingRoute,
    note: drivingRoute
      ? "Based on real road routing"
      : "Estimated - no road route found, using straight-line distance",
  });

  // --- Bus: same roads as car, but slower average speed (stops, traffic) ---
  const busDurationMin = (roadKm / 40) * 60;
  options.push({
    id: "bus",
    label: "Bus",
    distanceKm: roadKm,
    durationMin: busDurationMin,
    fare: formatFare(roadKm * 1.5),
    isLiveData: false,
    note: "Estimated - live bus schedules not available",
  });

  // --- Train: assumes rail distance close to road distance, moderate speed ---
  const trainKm = roadKm * 1.05;
  const trainDurationMin = (trainKm / 55) * 60;
  options.push({
    id: "train",
    label: "Train",
    distanceKm: trainKm,
    durationMin: trainDurationMin,
    fare: formatFare(trainKm * 1.2),
    isLiveData: false,
    note: "Estimated - live train schedules not available",
  });

  // --- Flight: only worth showing for longer distances; direct-line distance ---
  if (straightLineKm > 300) {
    const flightAirMin = (straightLineKm / 700) * 60;
    const flightDurationMin = flightAirMin + 120; // +2h for check-in/security/taxi
    options.push({
      id: "flight",
      label: "Flight",
      distanceKm: straightLineKm,
      durationMin: flightDurationMin,
      fare: formatFare(3000 + straightLineKm * 6),
      isLiveData: false,
      note: "Estimated - live flight schedules & fares not available",
    });
  }

  // Attach formatted duration + recommendation badges
  const fastest = [...options].sort((a, b) => a.durationMin - b.durationMin)[0];
  const cheapest = [...options]
    .filter((o) => o.fare)
    .sort((a, b) => parseFloat(a.fare.replace(/[^\d.]/g, "")) - parseFloat(b.fare.replace(/[^\d.]/g, "")))[0];

  return options.map((option) => ({
    ...option,
    durationLabel: formatDuration(option.durationMin),
    distanceLabel: `${Math.round(option.distanceKm)} km`,
    isFastest: option.id === fastest?.id,
    isCheapest: option.id === cheapest?.id && option.id !== fastest?.id,
  }));
};