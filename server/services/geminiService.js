const { getGeminiModel } = require("../config/gemini");
const { buildTravelPrompt } = require("../prompts/travelPrompt");

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
 * Calls Gemini with the trip details and returns a parsed JSON object.
 * Throws if the model response cannot be parsed as JSON.
 */
const generateTripPlan = async (tripDetails) => {
  const model = getGeminiModel();
  const prompt = buildTravelPrompt(tripDetails);

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  const cleaned = cleanJsonResponse(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", cleaned);
    throw new Error(
      "AI service returned an unexpected format. Please try again."
    );
  }
};

module.exports = { generateTripPlan };
