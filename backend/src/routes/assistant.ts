import { Router } from "express";

import { getAssistantResponse } from "../services/openai";

import type { ConversationMessage, ProcedureMatch } from "../types/assistant";

type AssistantService = (
  language: string,
  conversation: ConversationMessage[],
) => Promise<ProcedureMatch>;

export const createAssistantRouter = (
  assistantService: AssistantService = getAssistantResponse,
) => {
  const router = Router();

  router.post("/", async (request, response) => {
    const { message, location, language, conversation } = request.body;

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

    try {
      const conversationHistory =
        Array.isArray(conversation) && conversation.length > 0
          ? conversation
          : [
              {
                role: "user" as const,
                content: message.trim(),
              },
            ];

      const assistantResponse = await assistantService(
        language,
        conversationHistory,
      );

      return response.json(assistantResponse);
    } catch (error) {
      console.error("Assistant request failed:", error);

      return response.status(500).json({
        error: "Failed to process assistant request",
      });
    }
  });

  return router;
};

export default createAssistantRouter();
