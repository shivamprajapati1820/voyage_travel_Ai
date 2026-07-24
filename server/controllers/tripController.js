const asyncHandler = require("express-async-handler");
const Trip = require("../models/Trip");
const { generateTripPlan } = require("../services/geminiService");
const { sendSuccess } = require("../utils/apiResponse");

/**
 * @desc    Create a new trip AND generate the AI plan in one call
 * @route   POST /api/trips/create
 * @access  Private
 */
const createTrip = asyncHandler(async (req, res) => {
  const {
    destination,
    location,
    budget,
    travelers,
    startDate,
    endDate,
    travelType,
    interests,
  } = req.body;

  if (new Date(startDate) > new Date(endDate)) {
    res.status(400);
    throw new Error("Start date cannot be after end date");
  }

  // 1. Create the trip record first (status: draft)
  const trip = await Trip.create({
    userId: req.user._id,
    destination,
    location,
    budget,
    travelers,
    startDate,
    endDate,
    travelType,
    interests,
    status: "draft",
  });

  // 2. Attempt AI generation. If it fails, the trip still exists
  //    (status: failed) and the user can retry from the trip details page.
  try {
    const aiResponse = await generateTripPlan({
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      travelType,
      interests,
    });

    trip.aiResponse = aiResponse;
    trip.status = "generated";
    await trip.save();
  } catch (error) {
    trip.status = "failed";
    await trip.save();
    console.error("AI generation failed:", error.message);
  }

  sendSuccess(res, 201, "Trip created", { trip });
});

/**
 * @desc    Get all trips for the logged-in user
 * @route   GET /api/trips
 * @access  Private
 */
const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  sendSuccess(res, 200, "Trips fetched", { trips, count: trips.length });
});

/**
 * @desc    Get a single trip by id
 * @route   GET /api/trips/:id
 * @access  Private
 */
const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  sendSuccess(res, 200, "Trip fetched", { trip });
});

/**
 * @desc    Delete a trip
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  await trip.deleteOne();

  sendSuccess(res, 200, "Trip deleted");
});

/**
 * @desc    Retry AI generation for an existing trip (e.g. after failure)
 * @route   POST /api/trips/:id/regenerate
 * @access  Private
 */
const regenerateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const aiResponse = await generateTripPlan({
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    budget: trip.budget,
    travelers: trip.travelers,
    travelType: trip.travelType,
    interests: trip.interests,
  });

  trip.aiResponse = aiResponse;
  trip.status = "generated";
  await trip.save();

  sendSuccess(res, 200, "Trip regenerated", { trip });
});

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
  regenerateTrip,
};
