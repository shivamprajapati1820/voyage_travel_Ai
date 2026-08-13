/**
 * Builds the prompt for the "Smart Time Guide" feature. Given the trip's
 * EXISTING itinerary, the user's departure city/date/time, and their chosen
 * transport mode, this asks Gemini to sequence a full, realistic hour-by-hour
 * schedule covering departure -> every day of the trip -> return home.
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
  transportMode,
  dayDates = [],
  existingItinerary,
}) => {
  const distanceLine =
    distanceKm != null
      ? `- Distance to Destination: ~${Math.round(distanceKm)} km\n- Estimated Travel Duration (${transportMode}): ${travelDurationLabel}\n`
      : "- Distance/travel duration to destination could not be calculated (no route found) - use your best realistic estimate.\n";

  const dayDatesBlock = dayDates.map((d) => `Day ${d.dayNumber}: ${d.label}`).join("\n");

  return `
You are Voyage AI's Smart Time Guide generator. Build a COMPLETE, realistic, hour-by-hour schedule for a traveler's ENTIRE trip - starting with departure from their current location and ending with their return home after the last day.

DEPARTURE DETAILS:
- Current Location: ${currentCity}
- Departure Date & Time: ${currentDateTime}
- Chosen Transport Mode: ${transportMode} (use this exact mode for BOTH the outbound and return journey - do not substitute another mode)
- Destination: ${destination}
${distanceLine}- Budget: ${budget}
- Number of Travelers: ${travelers}
- Travel Style: ${travelType}

TRIP CALENDAR (the trip spans these exact days - use these labels verbatim for "dayLabel"):
${dayDatesBlock}

EXISTING TRIP PLAN (already generated - do NOT recreate this, reuse the REAL names from it for each day):
${existingItinerary || "No existing itinerary details available - use general best practices for this destination."}

INSTRUCTIONS:
1. Respond with STRICT, VALID JSON ONLY. No markdown, no code fences, no commentary before or after.
2. Build the FULL journey, in order:
   a. Departure from "${currentCity}" at the given departure date/time via ${transportMode}.
   b. Transit step(s) (station/airport arrival, boarding, journey) appropriate for ${transportMode}.
   c. Arrival at "${destination}", hotel check-in.
   d. For EVERY day listed in the TRIP CALENDAR above, a full day schedule: breakfast, 2-3 sightseeing stops with real attraction names from the existing trip plan, lunch at a real restaurant, more sightseeing/shopping, dinner, and rest - matching that day's plan from the EXISTING TRIP PLAN above as closely as possible.
   e. On the FINAL day in the TRIP CALENDAR, after the day's activities wrap up, include: hotel checkout, departure from "${destination}" via ${transportMode}, transit, and arrival back at "${currentCity}".
3. NAME REAL PLACES, not generic labels: "checkin"/"rest" steps MUST name the specific hotel from the existing trip plan; "breakfast"/"lunch"/"dinner" steps MUST name a specific restaurant from the existing trip plan; "sightseeing" steps MUST name a specific attraction from the existing trip plan. Put that specific name in the "place" field for that step - never leave a meal, stay, or sightseeing step without a real named place if one is available.
4. CRITICAL - respect the departure time: if the departure is already late in the day such that arrival/check-in/dinner/rest are the only realistic steps for Day 1, do exactly that - do NOT cram sightseeing into arrival night. Move that day's sightseeing to the next day and clearly explain WHY in that step's "adjustmentNote" field.
5. Follow this exact JSON schema:

{
  "summary": {
    "currentLocation": "string",
    "currentTime": "string - the departure date & time, human readable",
    "destination": "string",
    "transport": "string - the chosen transport mode",
    "distance": "string - e.g. '450 km'",
    "travelDuration": "string - e.g. '8 hr 30 min'"
  },
  "timeline": [
    {
      "time": "string - e.g. '8:00 AM'",
      "dayLabel": "string - use the exact labels from TRIP CALENDAR above, plus 'Departure' and 'Return Journey' where relevant",
      "type": "one of: current | departure | transit | arrival | checkin | breakfast | lunch | dinner | sightseeing | rest | other",
      "place": "string or null - the SPECIFIC hotel/restaurant/attraction name for this step. Null only for steps with no specific named place, like departure or transit.",
      "title": "string - short step title",
      "description": "string - 1-2 sentences of detail",
      "adjustmentNote": "string or null - only set if this step was moved from its originally expected time/day, explaining why"
    }
  ],
  "notes": ["string - any general notes about adjustments or assumptions made"]
}

6. The "timeline" array MUST cover the departure, every day in the TRIP CALENDAR, and the return journey - this is a full end-to-end trip schedule, not just a single day.
7. Keep everything realistic and specific to "${destination}" - reference real attraction, hotel, and restaurant names from the existing trip plan wherever possible.
8. Do not include any text outside the JSON object.
`.trim();
};

module.exports = { buildTimeGuidePrompt };