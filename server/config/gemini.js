const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Initializes and exports the Google Gemini client.
 * Model name is configurable via .env (defaults to gemini-1.5-flash).
 */
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  GEMINI_API_KEY is not set. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });
};

module.exports = { getGeminiModel };
