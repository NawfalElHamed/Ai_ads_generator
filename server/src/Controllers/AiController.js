// server/src/Controllers/AiController.js
const AiService = require("../Services/AiService");

async function startOnboarding(req, res) {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const lastUserMessage = messages[messages.length - 1];

    const aiText = await AiService.sendOnboardingTurn(lastUserMessage);

    return res.json({ reply: aiText });
  } catch (err) {
    console.error("❌ Error in startOnboarding:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  startOnboarding,
};
