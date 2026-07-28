const asyncHandler = require("express-async-handler");
const { generateTripPlan, generateSmartTimeGuide } = require("../services/geminiService");
const { sendSuccess } = require("../utils/apiResponse");
const Trip = require("../models/Trip");

/**
 * @desc    Generate an AI travel plan WITHOUT persisting a trip.
 *          Useful for a "preview before saving" UX on the Create Trip page.
 * @route   POST /api/ai/generate
 * @access  Private
 */
const generatePlan = asyncHandler(async (req, res) => {
  const {
    destination,
    startDate,
    endDate,
    budget,
    travelers,
    travelType,
    interests,
  } = req.body;

  if (!destination || !startDate || !endDate || !budget || !travelers) {
    res.status(400);
    throw new Error("Missing required trip details for AI generation");
  }

  const aiResponse = await generateTripPlan({
    destination,
    startDate,
    endDate,
    budget,
    travelers,
    travelType,
    interests,
  });

  sendSuccess(res, 200, "AI plan generated", { aiResponse });
});

/**
 * Condenses an existing trip's Day 1 activities + attraction names into a
 * short text block for the time guide prompt, so Gemini can reference real
 * plan details without us re-sending (or it re-generating) the full plan.
 */
const summarizeExistingPlan = (aiResponse) => {
  if (!aiResponse) return "";
  const parts = [];

  const day1 = aiResponse.itinerary?.[0];
  if (day1) {
    const activityLines = (day1.activities || [])
      .map((a) => `${a.time}: ${a.activity}`)
      .join("; ");
    parts.push(`Day 1 plan (${day1.title || ""}): ${activityLines}`);
  }

  const attractionNames = (aiResponse.attractions || []).map((a) => a.name).join(", ");
  if (attractionNames) parts.push(`Key attractions: ${attractionNames}`);

  const hotelName = aiResponse.hotels?.[0]?.name;
  if (hotelName) parts.push(`Suggested hotel: ${hotelName}`);

  return parts.join("\n");
};

/**
 * @desc    Generate the "Smart Time Guide" - hour-by-hour schedule from the
 *          user's real current location/time through arrival at their trip's
 *          destination. Reuses the trip's already-generated itinerary rather
 *          than creating a new one.
 * @route   POST /api/ai/time-guide
 * @access  Private
 */
const generateTimeGuide = asyncHandler(async (req, res) => {
  const {
    tripId,
    currentCity,
    currentDateTime,
    distanceKm,
    travelDurationLabel,
    recommendedTransport,
  } = req.body;

  if (!tripId || !currentCity || !currentDateTime) {
    res.status(400);
    throw new Error("Missing required details for the Smart Time Guide");
  }

  const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const timeGuide = await generateSmartTimeGuide({
    currentCity,
    currentDateTime,
    destination: trip.destination,
    budget: trip.budget,
    travelers: trip.travelers,
    travelType: trip.travelType,
    distanceKm,
    travelDurationLabel,
    recommendedTransport,
    existingItinerary: summarizeExistingPlan(trip.aiResponse),
  });

  trip.aiResponse = { ...trip.aiResponse, timeGuide };
  trip.markModified("aiResponse");
  await trip.save();

  sendSuccess(res, 200, "Smart Time Guide generated", { timeGuide });
});

module.exports = { generatePlan, generateTimeGuide };