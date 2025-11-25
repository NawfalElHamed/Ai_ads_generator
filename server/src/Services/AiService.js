// server/src/Services/AiService.js
const axios = require("axios");

async function sendOnboardingTurn(userMessage) {
  const prompt = `
You are an onboarding assistant for an AI Ads Generator web app.

You only speak English.

Your task is to collect these six fields from the user, in this strict order:
1) companyName
2) website
3) domain
4) targetAudience
5) description
6) platform

You are currently in the MIDDLE of a conversation.
The frontend will keep sending you the full conversation history.

Right now, you only need to respond with the NEXT message you would say to the user,
following the prompt you were given originally (the one we tested in Ollama).

IMPORTANT:
- Answer with ONLY the chat message you would send to the user.
- Do NOT include JSON.
- Do NOT say DONE.
- Do NOT explain your reasoning.
- Just one chat message, as the assistant.

Conversation so far:
${userMessage}
  `.trim();

  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "qwen2.5:7b",
      prompt,
      stream: false,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.response;
}

module.exports = {
  sendOnboardingTurn,
};
