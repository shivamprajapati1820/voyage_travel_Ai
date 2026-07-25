// Metadata for the Instant Budget Switch feature on Trip Details.
// Keys MUST match the keys Gemini returns inside aiResponse.budgetVariants
// (see server/prompts/travelPrompt.js).

export const BUDGET_MODES = [
  { key: "cheapest", label: "Cheapest", emoji: "💸" },
  { key: "budget", label: "Budget", emoji: "💰" },
  { key: "standard", label: "Standard", emoji: "⭐" },
  { key: "premium", label: "Premium", emoji: "💎" },
  { key: "luxury", label: "Luxury", emoji: "👑" },
];