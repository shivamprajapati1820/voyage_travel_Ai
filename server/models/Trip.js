const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    // Optional lat/lng captured from the map autocomplete for display
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
    },
    travelers: {
      type: Number,
      required: [true, "Number of travelers is required"],
      min: 1,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    travelType: {
      type: String,
      enum: ["Solo", "Couple", "Family", "Friends", "Business"],
      default: "Solo",
    },
    interests: {
      type: [String],
      default: [],
    },
    // Raw + structured AI response from Gemini
    aiResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "generated", "failed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

tripSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Trip", tripSchema);
