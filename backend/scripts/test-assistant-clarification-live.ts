import "dotenv/config";

import assert from "node:assert/strict";

import { getAssistantResponse } from "../src/services/openai";

import type { ConversationMessage } from "../src/types/assistant";

const conversation: ConversationMessage[] = [
  {
    role: "user",
    content: "Ich brauche Hilfe mit Dokumenten.",
  },
];

const runTest = async () => {
  console.log("Testing live AI clarification...\n");

  console.log("User request:");
  console.log(conversation[0].content);
  console.log("\nSending request to OpenAI...\n");

  const response = await getAssistantResponse("de", conversation);

  console.log("AI response:");
  console.log(JSON.stringify(response, null, 2));

  console.log("\nResponse status:", response.status);

  assert.equal(
    response.status,
    "clarification_needed",
    "AI should ask for clarification for an ambiguous request",
  );

  assert.ok(
    response.questions && response.questions.length > 0,
    "AI should provide at least one clarification question",
  );

  const question = response.questions[0];

  assert.ok(
    question.question.length > 0,
    "Clarification question should not be empty",
  );

  assert.equal(
    question.type,
    "single_choice",
    "Question should be single_choice",
  );

  if (question.type === "single_choice") {
    assert.ok(
      question.options.length >= 2,
      "Single-choice question should contain at least two options",
    );
  }

  console.log("✓ AI correctly requests clarification");
  console.log("✓ Clarification question is valid");
  console.log("✓ Answer options are provided");
};

runTest().catch((error) => {
  console.error("\nLive AI clarification test failed:");
  console.error(error);
  process.exitCode = 1;
});
