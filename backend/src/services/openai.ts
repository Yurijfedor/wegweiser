import OpenAI from "openai";

import { availableProcedures } from "../data/procedures";
import { validateAssistantResponse } from "./validateAssistantResponse";

import type { ConversationMessage, ProcedureMatch } from "../types/assistant";

const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

const proceduresPrompt = availableProcedures
  .map((procedure) => `- ${procedure.id}: ${procedure.description}`)
  .join("\n");

export const getAssistantResponse = async (
  language: string,
  conversation: ConversationMessage[] = [],
): Promise<ProcedureMatch> => {
  const openai = getOpenAIClient();

  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: [
      {
        role: "system",
        content: `
        You are the AI assistant for Wegweiser.

        Your task is to understand the user's request and determine whether it matches one of the available administrative procedures.

        Available procedures:
        ${proceduresPrompt}

        Return ONLY valid JSON.
        Do not use Markdown.
        Do not add any text outside the JSON.
        Do not invent procedure IDs.

        Use the full conversation history to understand the user's situation.

        Do not guess a procedure when the available information is still ambiguous.

        If the user's latest answer does not provide enough information to identify one specific procedure, ask another clarifying question.

        Only return "matched" when you have enough information to confidently identify one available procedure.

        If the user's request clearly matches one procedure, return:
        {
        "status": "matched",
        "language": "<user language>",
        "procedureId": "<existing procedure ID>",
        "confidence": <number between 0 and 1>
        }

        If the request is ambiguous or there is not enough information to determine the procedure, return:
        {
        "status": "clarification_needed",
        "language": "<user language>",
        "message": "<short message in the user's language>",
        "questions": [
            {
            "id": "<question ID>",
            "question": "<clarifying question in the user's language>",
            "type": "single_choice",
            "options": ["<option 1>", "<option 2>"]
            }
        ]
        }

        If the request does not match any available procedure, return:
        {
        "status": "not_supported",
        "language": "<user language>",
        "message": "<short helpful message in the user's language>"
        }
        `,
      },
      ...conversation,
    ],
  });

  try {
    const parsedResponse: unknown = JSON.parse(response.output_text);

    return validateAssistantResponse(parsedResponse);
  } catch {
    throw new Error("OpenAI returned an invalid JSON response");
  }
};
