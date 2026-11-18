import "dotenv/config";
import assert from "node:assert/strict";
import { getAssistantResponse } from "../src/services/openai";
import type { ConversationMessage } from "../src/types/assistant";

const conversation: ConversationMessage[] = [
  {
    role: "user",
    content: "Wie kann ich eine Pizza zu Hause backen?",
  },
];

const runTest = async () => {
  console.log("Testing live AI unsupported request...\n");

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
    "AI should reject unrelated requests",
  );

  console.log("✓ AI correctly identifies unsupported request");
};

runTest().catch((error) => {
  console.error("\nLive AI unsupported test failed:");
  console.error(error);
  process.exitCode = 1;
});
