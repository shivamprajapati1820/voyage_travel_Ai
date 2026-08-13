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
 * Condenses an existing trip's FULL day-by-day itinerary + hotel/restaurant/
 * attraction names into a text block for the time guide prompt, so Gemini
 * can reference real plan details across every day instead of re-inventing
 * (or only knowing about) a single day.
 */
const summarizeFullPlan = (aiResponse) => {
  if (!aiResponse) return "";
  const parts = [];

  (aiResponse.itinerary || []).forEach((day) => {
    const activityLines = (day.activities || [])
      .map((a) => `${a.time}: ${a.activity}`)
      .join("; ");
    let line = `Day ${day.day}${day.title ? ` (${day.title})` : ""}: ${activityLines}`;
    if (day.hotelStay) line += ` | Hotel: ${day.hotelStay}`;
    parts.push(line);
  });

  const attractionNames = (aiResponse.attractions || []).map((a) => a.name).join(", ");
  if (attractionNames) parts.push(`Key attractions: ${attractionNames}`);

  const hotelNames = (aiResponse.hotels || []).map((h) => h.name).join(", ");
  if (hotelNames) parts.push(`Available hotels: ${hotelNames}`);

  const restaurantNames = (aiResponse.restaurants || []).map((r) => r.name).join(", ");
  if (restaurantNames) parts.push(`Available restaurants: ${restaurantNames}`);

  return parts.join("\n");
};

/**
 * Builds a labeled list of calendar dates for the trip, starting from the
 * chosen departure date, so Gemini doesn't have to compute date math itself.
 */
const buildDayDates = (startDateStr, totalDays) => {
  const start = new Date(startDateStr);
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const days = [];
  for (let i = 0; i < totalDays; i += 1) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push({ dayNumber: i + 1, label: formatter.format(d) });
  }
  return days;
};

/**
 * @desc    Generate the "Smart Time Guide" - a full, hour-by-hour schedule
 *          for the whole trip, starting from the user's chosen departure
 *          location/date/transport mode and ending with their return home.
 *          Reuses the trip's already-generated itinerary rather than
 *          creating a new one.
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
    transportMode,
    travelDate,
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

  const totalDays =
    Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  const dayDates = buildDayDates(travelDate || new Date().toISOString(), totalDays);

  const timeGuide = await generateSmartTimeGuide({
    currentCity,
    currentDateTime,
    destination: trip.destination,
    budget: trip.budget,
    travelers: trip.travelers,
    travelType: trip.travelType,
    distanceKm,
    travelDurationLabel,
    transportMode: transportMode || "Car",
    dayDates,
    existingItinerary: summarizeFullPlan(trip.aiResponse),
  });

  trip.aiResponse = { ...trip.aiResponse, timeGuide };
  trip.markModified("aiResponse");
  await trip.save();

  sendSuccess(res, 200, "Smart Time Guide generated", { timeGuide });
});

module.exports = { generatePlan, generateTimeGuide };