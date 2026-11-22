import OpenAI from "openai";
import { getOpenAIClient } from "../openaiClient";
import type { ConversationMessage } from "../../types/assistant";

export type IntentClassification =
  | "administrative"
  | "out_of_scope"
  | "ambiguous";

export interface IntentClassifierResult {
  intent: IntentClassification;
  reason?: string;
}

export interface IntentClassifierInput {
  message: string;
  conversation: ConversationMessage[];
  language: string;
  location: {
    countryCode: string;
    city: string;
  };
}

export type IntentClassifier = (
  input: IntentClassifierInput,
) => Promise<IntentClassifierResult>;

export const createIntentClassifier = (openai?: OpenAI): IntentClassifier => {
  return async (input) => {
    const client = openai ?? getOpenAIClient();

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content: `
You are the intent classifier for Wegweiser.

Wegweiser helps users with administrative matters in Germany.

Classify the user's latest request using the full conversation context.

Return only valid JSON.

Use exactly one of these intents:

- administrative: the request concerns administrative procedures,
  public authorities, official documents, applications, benefits,
  registrations, or related matters.

- out_of_scope: the request is clearly unrelated to administrative
  matters, such as finding restaurants, supermarkets, shopping,
  recipes, entertainment, or general lifestyle recommendations.

- ambiguous: the user's intention is unclear and requires clarification.

A request about finding a public authority or its contact details
is administrative when connected to an administrative matter.

Do not classify a request as out_of_scope just because the exact
procedure is not available in the catalog.

The user's language is: ${input.language}
The user's location is: ${input.location.city}, ${input.location.countryCode}

Return this JSON structure:

{
  "intent": "administrative | out_of_scope | ambiguous",
  "reason": "short explanation"
}
          `,
        },
        ...input.conversation,
      ],
    });

    let parsed: unknown;

    try {
      parsed = JSON.parse(response.output_text);
    } catch {
      throw new Error("Intent classifier returned invalid JSON");
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error("Intent classification must be an object");
    }

    const result = parsed as Record<string, unknown>;

    const allowedIntents: IntentClassification[] = [
      "administrative",
      "out_of_scope",
      "ambiguous",
    ];

    if (
      typeof result.intent !== "string" ||
      !allowedIntents.includes(result.intent as IntentClassification)
    ) {
      throw new Error("Invalid intent classification");
    }

    if (result.reason !== undefined && typeof result.reason !== "string") {
      throw new Error("Invalid intent classification reason");
    }

    return {
      intent: result.intent as IntentClassification,
      reason: result.reason as string | undefined,
    };
  };
};
