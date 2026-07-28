const { getGeminiModel } = require("../config/gemini");
const { buildTravelPrompt } = require("../prompts/travelPrompt");
const { buildTimeGuidePrompt } = require("../prompts/timeGuidePrompt");

/**
 * Strips markdown code fences if Gemini wraps the JSON in ```json ... ```
 * even though we instruct it not to - models occasionally do this anyway.
 */
const cleanJsonResponse = (text) => {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
};

/**
 * Shared helper: sends a prompt to Gemini and parses the JSON response.
 * Used by both generateTripPlan and generateSmartTimeGuide so the
 * request/parse/error-handling logic isn't duplicated.
 */
const askGeminiForJson = async (prompt, errorContext) => {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  const cleaned = cleanJsonResponse(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(`Failed to parse Gemini response as JSON (${errorContext}):`, cleaned);
    throw new Error(
      "AI service returned an unexpected format. Please try again."
    );
  }
};

/**
 * Calls Gemini with the trip details and returns a parsed JSON object.
 * Throws if the model response cannot be parsed as JSON.
 */
const generateTripPlan = async (tripDetails) => {
  const prompt = buildTravelPrompt(tripDetails);
  return askGeminiForJson(prompt, "trip plan");
};

/**
 * Generates the "Smart Time Guide" - an hour-by-hour schedule starting
 * from the user's current location/time through to the destination.
 * Reuses the existing trip's itinerary/attractions instead of
 * regenerating them, so Gemini only has to sequence a timeline.
 */
const generateSmartTimeGuide = async (guideDetails) => {
  const prompt = buildTimeGuidePrompt(guideDetails);
  return askGeminiForJson(prompt, "smart time guide");
};

module.exports = { generateTripPlan, generateSmartTimeGuide };