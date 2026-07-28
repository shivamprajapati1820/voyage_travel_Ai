const express = require("express");
const { generatePlan, generateTimeGuide } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generatePlan);
router.post("/time-guide", protect, generateTimeGuide);

module.exports = router;