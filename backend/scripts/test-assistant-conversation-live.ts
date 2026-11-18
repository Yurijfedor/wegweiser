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
  console.log("Testing live multi-turn conversation...\n");

  // Turn 1: ambiguous request
  console.log("Turn 1 — User:");
  console.log(conversation[0].content);

  const firstResponse = await getAssistantResponse("de", conversation);

  console.log("\nTurn 1 — AI:");
  console.log(JSON.stringify(firstResponse, null, 2));

  assert.equal(
    firstResponse.status,
    "clarification_needed",
    "AI should ask for clarification",
  );

  assert.ok(
    firstResponse.questions && firstResponse.questions.length > 0,
    "AI should provide clarification questions",
  );

  console.log("\n✓ First turn correctly requests clarification");

  // Add AI response to conversation history
  let assistantContent = firstResponse.message ?? "";

  if (firstResponse.questions) {
    assistantContent += "\n";

    for (const question of firstResponse.questions) {
      assistantContent += question.question + "\n";

      if (question.type === "single_choice") {
        assistantContent += question.options.join("\n");
      }
    }
  }

  conversation.push({
    role: "assistant",
    content: assistantContent,
  });

  // Turn 2: user clarifies
  const userClarification = "Ich möchte meinen Wohnsitz anmelden.";

  conversation.push({
    role: "user",
    content: userClarification,
  });

  console.log("\nTurn 2 — User:");
  console.log(userClarification);

  const secondResponse = await getAssistantResponse("de", conversation);

  console.log("\nTurn 2 — AI:");
  console.log(JSON.stringify(secondResponse, null, 2));

  assert.equal(
    secondResponse.status,
    "matched",
    "AI should match a procedure after clarification",
  );

  assert.equal(
    secondResponse.procedureId,
    "wohnsitz-anmelden",
    "AI should select wohnsitz-anmelden",
  );

  console.log("\n✓ AI correctly understands clarification");
  console.log("✓ Correct procedure matched");
  console.log("\n🎉 Multi-turn conversation test passed!");
};

runTest().catch((error) => {
  console.error("\nMulti-turn live test failed:");
  console.error(error);
  process.exitCode = 1;
});
