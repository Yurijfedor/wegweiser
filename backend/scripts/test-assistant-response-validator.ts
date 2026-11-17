import assert from "node:assert/strict";

import { validateAssistantResponse } from "../src/services/validateAssistantResponse";

const validMatchedResponse = {
  status: "matched",
  language: "uk",
  procedureId: "wohnsitz-anmelden",
  confidence: 0.95,
};

console.log("Testing Assistant Response Validator...\n");

// Test 1: Valid matched response
const matched = validateAssistantResponse(validMatchedResponse);

assert.equal(matched.status, "matched");
assert.equal(matched.procedureId, "wohnsitz-anmelden");

console.log("✓ Valid matched response");

// Test 2: Unknown procedure ID
assert.throws(
  () =>
    validateAssistantResponse({
      ...validMatchedResponse,
      procedureId: "unknown-procedure",
    }),
  /Unknown procedure ID/,
);

console.log("✓ Unknown procedure ID rejected");

// Test 3: Invalid status
assert.throws(
  () =>
    validateAssistantResponse({
      ...validMatchedResponse,
      status: "unknown_status",
    }),
  /Invalid assistant response status/,
);

console.log("✓ Invalid status rejected");

// Test 4: Missing language
assert.throws(
  () =>
    validateAssistantResponse({
      status: "matched",
      procedureId: "wohnsitz-anmelden",
    }),
  /language is required/,
);

console.log("✓ Missing language rejected");

// Test 5: Invalid confidence
assert.throws(
  () =>
    validateAssistantResponse({
      ...validMatchedResponse,
      confidence: 1.5,
    }),
  /Confidence must be a number/,
);

console.log("✓ Invalid confidence rejected");

// Test 6: Valid clarification response
const clarification = validateAssistantResponse({
  status: "clarification_needed",
  language: "uk",
  questions: [
    {
      id: "city",
      question: "У якому місті ви проживаєте?",
      type: "text",
    },
    {
      id: "housing",
      question: "Який у вас тип житла?",
      type: "single_choice",
      options: ["Оренда", "Власне житло"],
    },
  ],
});

assert.equal(clarification.status, "clarification_needed");
assert.equal(clarification.questions?.length, 2);

console.log("✓ Valid clarification response");

// Test 7: Invalid clarification question
assert.throws(
  () =>
    validateAssistantResponse({
      status: "clarification_needed",
      language: "uk",
      questions: [
        {
          id: "housing",
          question: "Оберіть тип житла",
          type: "single_choice",
          options: [],
        },
      ],
    }),
  /Valid clarification questions are required/,
);

console.log("✓ Invalid clarification question rejected");

console.log("\nAll Assistant Response Validator tests passed!");
