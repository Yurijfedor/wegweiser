import { Router } from "express";

import { getAssistantResponse } from "../services/openai";

const router = Router();

router.post("/", async (request, response) => {
  const { message, location, language } = request.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return response.status(400).json({
      error: "Message is required",
    });
  }

  if (!location?.countryCode || !location?.city) {
    return response.status(400).json({
      error: "Location is required",
    });
  }

  if (!language) {
    return response.status(400).json({
      error: "Language is required",
    });
  }

  // Тимчасова відповідь для перевірки API.
  try {
    const assistantResponse = await getAssistantResponse(
      message.trim(),
      language,
    );

    return response.json(assistantResponse);
  } catch (error) {
    console.error("OpenAI request failed:", error);

    return response.status(500).json({
      error: "Failed to process assistant request",
    });
  }
});

export default router;
