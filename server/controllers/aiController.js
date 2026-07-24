const asyncHandler = require("express-async-handler");
const { generateTripPlan } = require("../services/geminiService");
const { sendSuccess } = require("../utils/apiResponse");

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

module.exports = { generatePlan };
