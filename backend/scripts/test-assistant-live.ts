import "dotenv/config";

import assert from "node:assert/strict";

import { getAssistantResponse } from "../src/services/openai";

import type { ConversationMessage } from "../src/types/assistant";

const conversation: ConversationMessage[] = [
  {
    role: "user",
    content:
      "Ich bin nach Mayen umgezogen und möchte meinen Wohnsitz anmelden. " +
      "Welche Behördengänge muss ich erledigen?",
  },
];

const runTest = async () => {
  console.log("Testing live AI Assistant...\n");
  console.log("User request:");
  console.log(conversation[0].content);
  console.log("\nSending request to OpenAI...\n");

  const response = await getAssistantResponse("de", conversation);

  console.log("AI response:");
  console.log(JSON.stringify(response, null, 2));

  console.log("\nTest result:");

  assert.equal(response.status, "matched", "AI should return matched status");

  assert.equal(
    response.procedureId,
    "wohnsitz-anmelden",
    "AI selected the wrong procedure",
  );

  console.log("✓ Correct procedure matched");
};

runTest().catch((error) => {
  console.error("\nLive AI test failed:");
  console.error(error);
  process.exitCode = 1;
});
