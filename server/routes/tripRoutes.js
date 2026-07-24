const express = require("express");
const { body } = require("express-validator");
const {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
  regenerateTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect); // all trip routes require authentication

router.post(
  "/create",
  [
    body("destination").trim().notEmpty().withMessage("Destination is required"),
    body("budget").isNumeric().withMessage("Budget must be a number"),
    body("travelers").isInt({ min: 1 }).withMessage("Travelers must be at least 1"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
  ],
  validate,
  createTrip
);

router.get("/", getTrips);
router.get("/:id", getTripById);
router.delete("/:id", deleteTrip);
router.post("/:id/regenerate", regenerateTrip);

module.exports = router;
