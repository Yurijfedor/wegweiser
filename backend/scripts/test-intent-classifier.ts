import assert from "node:assert/strict";

import { createIntentClassifier } from "../src/services/assistant/intentClassifier";

const createMockOpenAI = (output: string) => {
  return {
    responses: {
      create: async () => ({
        output_text: output,
      }),
    },
  } as never;
};

const baseInput = {
  message: "Wo kann ich Pizza kaufen?",
  conversation: [
    {
      role: "user" as const,
      content: "Wo kann ich Pizza kaufen?",
    },
  ],
  language: "de",
  location: {
    countryCode: "DE",
    city: "Mayen",
  },
};

const runTests = async () => {
  console.log("Testing Intent Classifier...\n");

  const outOfScopeClassifier = createIntentClassifier(
    createMockOpenAI(
      JSON.stringify({
        intent: "out_of_scope",
        reason: "Restaurant search is outside the scope of Wegweiser.",
      }),
    ),
  );

  const outOfScopeResult = await outOfScopeClassifier(baseInput);

  assert.equal(outOfScopeResult.intent, "out_of_scope");
  console.log("✓ Out-of-scope request");

  const administrativeClassifier = createIntentClassifier(
    createMockOpenAI(
      JSON.stringify({
        intent: "administrative",
        reason: "Residence registration is an administrative matter.",
      }),
    ),
  );

  const administrativeResult = await administrativeClassifier({
    ...baseInput,
    message: "Ich möchte meinen Wohnsitz anmelden.",
  });

  assert.equal(administrativeResult.intent, "administrative");
  console.log("✓ Administrative request");

  const ambiguousClassifier = createIntentClassifier(
    createMockOpenAI(
      JSON.stringify({
        intent: "ambiguous",
        reason: "The user's intention is unclear.",
      }),
    ),
  );

  const ambiguousResult = await ambiguousClassifier({
    ...baseInput,
    message: "Ich brauche Hilfe.",
  });

  assert.equal(ambiguousResult.intent, "ambiguous");
  console.log("✓ Ambiguous request");

  const invalidClassifier = createIntentClassifier(
    createMockOpenAI(
      JSON.stringify({
        intent: "something_else",
      }),
    ),
  );

  await assert.rejects(
    () => invalidClassifier(baseInput),
    /Invalid intent classification/,
  );

  console.log("✓ Invalid intent rejected");

  console.log("\nAll Intent Classifier tests passed!");
};

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
