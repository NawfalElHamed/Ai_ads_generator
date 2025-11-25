// server/src/Routes/AiRoute.js
const express = require("express");
const router = express.Router();

// import the controller object
const AiController = require("../Controllers/AiController");

// ✅ single handler, no trailing commas, no extra middlewares
router.post("/onboarding/start", AiController.startOnboarding);

module.exports = router;
