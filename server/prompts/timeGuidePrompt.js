/**
 * Builds the prompt for the "Smart Time Guide" feature. Unlike
 * travelPrompt.js (which invents a whole trip), this prompt gives Gemini
 * the trip's EXISTING itinerary/attractions and asks it to sequence a
 * realistic hour-by-hour schedule starting from the user's real current
 * location and real current time - no itinerary regeneration happens here.
 */
const buildTimeGuidePrompt = ({
  currentCity,
  currentDateTime,
  destination,
  budget,
  travelers,
  travelType,
  distanceKm,
  travelDurationLabel,
  recommendedTransport,
  existingItinerary,
}) => {
  const distanceLine =
    distanceKm != null
      ? `- Distance to Destination: ~${Math.round(distanceKm)} km\n- Estimated Travel Duration: ${travelDurationLabel}\n- Recommended Transport: ${recommendedTransport}\n`
      : "- Distance/travel duration to destination could not be calculated (no route found) - use your best realistic estimate.\n";

  return `
You are Voyage AI's Smart Time Guide generator. Build a realistic, hour-by-hour schedule for a traveler, starting from their CURRENT real-world location and CURRENT real-world time, all the way through arrival, check-in, and the day's activities at "${destination}".

CURRENT SITUATION:
- Current Location: ${currentCity}
- Current Date & Time: ${currentDateTime}
- Destination: ${destination}
${distanceLine}- Budget: ${budget}
- Number of Travelers: ${travelers}
- Travel Style: ${travelType}

EXISTING TRIP PLAN (already generated - do NOT recreate this, just weave relevant pieces into the timeline):
${existingItinerary || "No existing itinerary details available - use general best practices for this destination."}

INSTRUCTIONS:
1. Respond with STRICT, VALID JSON ONLY. No markdown, no code fences, no commentary before or after.
2. Build a realistic sequence of timeline steps starting from "Current Location" / "Current Time" and continuing through: departure, station/airport arrival (if relevant to the recommended transport), vehicle departure, arrival at destination, hotel check-in, meals (breakfast/lunch/dinner as time-appropriate), sightseeing with the best visiting time for each attraction, hotel return, and rest time.
3. CRITICAL - respect the current time: if it is already late in the day (e.g. evening/night) such that check-in, dinner, and rest are the only realistic remaining steps for today, do exactly that - do NOT cram sightseeing into tonight. Instead, intelligently move sightseeing/attraction visits to "Day 2" (or the next suitable day) and clearly explain WHY in that step's "adjustmentNote" field (e.g. "Moved to Day 2 because arrival is late evening").
4. Follow this exact JSON schema:

{
  "summary": {
    "currentLocation": "string",
    "currentTime": "string - human readable, e.g. '3:45 PM, 28 July 2026'",
    "destination": "string",
    "transport": "string - e.g. 'Car' or 'Train'",
    "distance": "string - e.g. '450 km'",
    "travelDuration": "string - e.g. '8 hr 30 min'"
  },
  "timeline": [
    {
      "time": "string - e.g. '3:45 PM' or 'Day 2, 8:00 AM'",
      "dayLabel": "string - e.g. 'Today' or 'Day 2'",
      "type": "one of: current | departure | transit | arrival | checkin | breakfast | lunch | dinner | sightseeing | rest | other",
      "title": "string - short step title",
      "description": "string - 1-2 sentences of detail",
      "adjustmentNote": "string or null - only set if this step was moved from its originally expected time/day, explaining why"
    }
  ],
  "notes": ["string - any general notes about adjustments or assumptions made"]
}

5. Keep the timeline realistic and specific to "${destination}" - reference real attraction names from the existing trip plan where possible.
6. Do not include any text outside the JSON object.
`.trim();
};

module.exports = { buildTimeGuidePrompt };