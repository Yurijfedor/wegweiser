import { Router } from "express";

import { getAssistantResponse } from "../services/openai";
import { createIntentClassifier } from "../services/assistant/intentClassifier";

import { createDiscoveryService } from "../services/discovery/discoveryService";

import { database } from "../database/database";
import { createSQLiteDiscoveryRepository } from "../services/discovery/sqliteDiscoveryRepository";

import type { DiscoveryService } from "../services/discovery/discoveryService";

import type { IntentClassifier } from "../services/assistant/intentClassifier";

import type { ConversationMessage, ProcedureMatch } from "../types/assistant";

type AssistantService = (
  language: string,
  conversation: ConversationMessage[],
) => Promise<ProcedureMatch>;

const defaultDiscoveryRepository = createSQLiteDiscoveryRepository(database);

const defaultDiscoveryService = createDiscoveryService({
  repository: defaultDiscoveryRepository,
});

export const createAssistantRouter = (
  assistantService: AssistantService = getAssistantResponse,
  intentClassifier: IntentClassifier = createIntentClassifier(),
  discoveryService: DiscoveryService = defaultDiscoveryService,
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

      const intentResult = await intentClassifier({
        message: message.trim(),
        conversation: conversationHistory,
        language,
        location: {
          countryCode: location.countryCode,
          city: location.city,
        },
      });

      if (intentResult.intent === "out_of_scope") {
        return response.json({
          status: "out_of_scope",
          language,
          message:
            language === "uk"
              ? "Я допомагаю лише з адміністративними питаннями та державними процедурами в Німеччині."
              : language === "de"
                ? "Ich helfe nur bei Verwaltungsangelegenheiten und behördlichen Verfahren in Deutschland."
                : "I only help with administrative matters and government procedures in Germany.",
        });
      }

      const assistantResponse = await assistantService(
        language,
        conversationHistory,
      );

      if (assistantResponse.status !== "not_supported") {
        return response.json(assistantResponse);
      }

      try {
        const discoveryResult = await discoveryService.discover({
          conversation: conversationHistory,
          location: {
            countryCode: location.countryCode,
            city: location.city,
            ...(typeof location.region === "string" && {
              region: location.region,
            }),
          },
        });

        if (discoveryResult.status === "candidate_created") {
          const candidate = discoveryResult.candidate;

          return response.json({
            status: "discovered",
            language,
            categoryId: candidate.procedure.categoryId,
            discoveredProcedure: {
              ...candidate.procedure,
              id: candidate.id,
            },
            verificationStatus: "unverified",
            message:
              language === "uk"
                ? "Ми знайшли цю процедуру автоматично. Вона ще не перевірена редактором. Будь ласка, перевірте інформацію та джерела у відповідній установі перед виконанням будь-яких дій."
                : language === "de"
                  ? "Wir haben dieses Verfahren automatisch gefunden. Es wurde noch nicht redaktionell geprüft. Bitte überprüfen Sie die Informationen und Quellen vor weiteren Schritten bei der zuständigen Behörde."
                  : "We found this procedure automatically. It has not yet been reviewed. Please verify the information and sources with the responsible authority before taking action.",
          });
        }

        return response.json(assistantResponse);
      } catch (discoveryError) {
        console.error("Discovery failed:", discoveryError);

        return response.json(assistantResponse);
      }
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
