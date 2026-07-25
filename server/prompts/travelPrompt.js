/**
 * Builds the prompt sent to Gemini for AI trip generation.
 * The model is instructed to return STRICT JSON so the backend
 * can parse and store it directly in Trip.aiResponse.
 */
const buildTravelPrompt = ({
  destination,
  startDate,
  endDate,
  budget,
  travelers,
  travelType,
  interests,
}) => {
  const days =
    Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    ) + 1;

  return `
You are Voyage AI, an expert travel planning assistant. Generate a detailed, realistic, and practical travel plan based on the trip details below.

TRIP DETAILS:
- Destination: ${destination}
- Start Date: ${startDate}
- End Date: ${endDate}
- Duration: ${days} day(s)
- Budget: ${budget} (total, in INR unless destination clearly implies another currency)
- Number of Travelers: ${travelers}
- Travel Type: ${travelType}
- Interests: ${interests && interests.length ? interests.join(", ") : "General sightseeing"}

INSTRUCTIONS:
1. Respond with STRICT, VALID JSON ONLY. No markdown, no code fences, no commentary before or after.
2. Follow this exact JSON schema:

{
  "tripSummary": "string - a short 3-4 sentence overview of the trip",
  "itinerary": [
    {
      "day": 1,
      "title": "string - short theme for the day",
      "activities": [
        { "time": "Morning", "activity": "string", "description": "string" },
        { "time": "Afternoon", "activity": "string", "description": "string" },
        { "time": "Evening", "activity": "string", "description": "string" }
      ]
    }
  ],
  "hotels": [
    { "name": "string", "area": "string", "priceRange": "string", "rating": "string", "description": "string" }
  ],
  "attractions": [
    { "name": "string", "category": "string", "description": "string", "estimatedTime": "string" }
  ],
  "restaurants": [
    { "name": "string", "cuisine": "string", "priceRange": "string", "mustTry": "string" }
  ],
  "estimatedBudget": {
    "accommodation": "string",
    "food": "string",
    "transportation": "string",
    "activities": "string",
    "miscellaneous": "string",
    "total": "string"
  },
  "transportation": {
    "gettingThere": "string",
    "localTransport": "string",
    "tips": "string"
  },
  "packingChecklist": ["string", "string"],
  "travelTips": ["string", "string"],
  "budgetVariants": {
    "cheapest": {
      "label": "Cheapest",
      "totalCost": "string - e.g. ₹7,999",
      "hotel": "string - hostel/guesthouse name or type",
      "restaurant": "string - street food / local eatery style",
      "transportation": "string - e.g. local buses, shared autos",
      "activities": "string - e.g. free beaches & public sightseeing",
      "optionalExperiences": ["string"]
    },
    "budget": {
      "label": "Budget",
      "totalCost": "string",
      "hotel": "string",
      "restaurant": "string",
      "transportation": "string",
      "activities": "string",
      "optionalExperiences": ["string"]
    },
    "standard": {
      "label": "Standard",
      "totalCost": "string",
      "hotel": "string",
      "restaurant": "string",
      "transportation": "string",
      "activities": "string",
      "optionalExperiences": ["string"]
    },
    "premium": {
      "label": "Premium",
      "totalCost": "string",
      "hotel": "string",
      "restaurant": "string",
      "transportation": "string",
      "activities": "string",
      "optionalExperiences": ["string"]
    },
    "luxury": {
      "label": "Luxury",
      "totalCost": "string - e.g. ₹45,999",
      "hotel": "string - 5-star resort name or type",
      "restaurant": "string - fine dining style",
      "transportation": "string - e.g. private airport transfer",
      "activities": "string - e.g. water sports, sunset cruise, spa",
      "optionalExperiences": ["string"]
    }
  }
}

3b. "budgetVariants" gives the user 5 complete, self-contained versions of this same trip (same destination, same duration) at increasing spend levels, so they can compare without regenerating. Each tier's totalCost MUST scale sensibly with the number of travelers (${travelers}) and duration (${days} day(s)) - "cheapest" should be a realistic shoestring number, "luxury" a realistic high-end number for this destination.

3. The "itinerary" array MUST contain exactly ${days} entries (one per day).
4. Keep money values as human-readable strings (e.g. "₹8,000 - ₹10,000").
5. Be specific to "${destination}" - use real, well-known place and hotel names where possible.
6. Do not include any text outside the JSON object.
`.trim();
};

module.exports = { buildTravelPrompt };