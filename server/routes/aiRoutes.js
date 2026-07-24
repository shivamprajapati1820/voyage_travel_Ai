const express = require("express");
const { generatePlan } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generatePlan);

module.exports = router;
