import "dotenv/config";
import assert from "node:assert/strict";
import { getAssistantResponse } from "../src/services/openai";
import type { ConversationMessage } from "../src/types/assistant";

const conversation: ConversationMessage[] = [
  {
    role: "user",
    content:
      "Ich möchte eine mobile Verkaufsbude auf einem öffentlichen Platz in Mayen aufstellen. Welche Genehmigung brauche ich?",
  },
];

const runTest = async () => {
  console.log("Testing live AI unsupported administrative request...\n");

  console.log("User request:");
  console.log(conversation[0].content);
  console.log("\nSending request to OpenAI...\n");

  const response = await getAssistantResponse("de", conversation);

  console.log("AI response:");
  console.log(JSON.stringify(response, null, 2));

  console.log("\nResponse status:", response.status);

  assert.equal(
    response.status,
    "not_supported",
    "AI should identify unsupported administrative procedures",
  );

  console.log("✓ AI correctly identifies unsupported administrative procedure");
};

runTest().catch((error) => {
  console.error("\nLive AI unsupported test failed:");
  console.error(error);
  process.exitCode = 1;
});
