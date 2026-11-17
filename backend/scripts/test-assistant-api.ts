import assert from "node:assert/strict";

import { createApp } from "../src/app";
import { createAssistantRouter } from "../src/routes/assistant";

import type {
  ConversationMessage,
  ProcedureMatch,
} from "../src/types/assistant";
const runTests = async () => {
  let receivedLanguage = "";
  let receivedConversation: ConversationMessage[] = [];

  let mockResponse: ProcedureMatch = {
    status: "matched",
    language: "uk",
    procedureId: "wohnsitz-anmelden",
    confidence: 0.99,
  };

  let mockError: Error | null = null;

  const mockAssistant = async (
    language: string,
    conversation: ConversationMessage[],
  ) => {
    receivedLanguage = language;
    receivedConversation = conversation;
    if (mockError) {
      throw mockError;
    }

    return mockResponse;
  };

  const app = createApp(createAssistantRouter(mockAssistant));
  const server = app.listen(0);

  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Could not determine test server address.");
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    console.log("Testing Assistant API...\n");

    // Test 1: Health endpoint
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthResponse.status, 200);

    const healthData = await healthResponse.json();
    assert.equal(healthData.status, "ok");

    console.log("✓ Health endpoint");

    // Test 2: Missing message
    const missingMessageResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: { countryCode: "DE", city: "Mayen" },
        language: "uk",
      }),
    });

    assert.equal(missingMessageResponse.status, 400);
    console.log("✓ Missing message validation");

    // Test 3: Missing location
    const missingLocationResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Ich möchte meinen Wohnsitz anmelden.",
        language: "de",
      }),
    });

    assert.equal(missingLocationResponse.status, 400);
    console.log("✓ Missing location validation");

    // Test 4: Valid request
    const validResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Хочу зареєструвати місце проживання.",
        location: { countryCode: "DE", city: "Mayen" },
        language: "uk",
      }),
    });

    assert.equal(validResponse.status, 200);

    const result = await validResponse.json();

    assert.equal(result.status, "matched");
    assert.equal(result.procedureId, "wohnsitz-anmelden");
    assert.equal(receivedLanguage, "uk");
    assert.equal(receivedConversation.length, 1);
    assert.equal(
      receivedConversation[0].content,
      "Хочу зареєструвати місце проживання.",
    );

    console.log("✓ Valid request and mock AI response");

    // Test 5: Clarification needed
    mockResponse = {
      status: "clarification_needed",
      language: "uk",
      message: "Уточніть, будь ласка, вашу ситуацію.",
      questions: [
        {
          id: "situation",
          question: "Що саме ви хочете зробити?",
          type: "single_choice",
          options: ["Зареєструвати житло", "Скасувати оренду"],
        },
      ],
    };

    const clarificationResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Мені потрібна допомога з житлом.",
        location: { countryCode: "DE", city: "Mayen" },
        language: "uk",
      }),
    });

    assert.equal(clarificationResponse.status, 200);

    const clarificationResult = await clarificationResponse.json();

    assert.equal(clarificationResult.status, "clarification_needed");
    assert.equal(clarificationResult.questions.length, 1);

    console.log("✓ Clarification response");

    // Test 6: Not supported
    mockResponse = {
      status: "not_supported",
      language: "uk",
      message: "На жаль, ця процедура поки не підтримується.",
    };

    const unsupportedResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Хочу відкрити ресторан.",
        location: { countryCode: "DE", city: "Mayen" },
        language: "uk",
      }),
    });

    assert.equal(unsupportedResponse.status, 200);

    const unsupportedResult = await unsupportedResponse.json();

    assert.equal(unsupportedResult.status, "not_supported");

    console.log("✓ Not supported response");

    // Test 7: Conversation history
    mockResponse = {
      status: "matched",
      language: "uk",
      procedureId: "wohnsitz-anmelden",
      confidence: 0.99,
    };

    const conversation: ConversationMessage[] = [
      { role: "user", content: "Мені потрібно оформити житло." },
      { role: "assistant", content: "Ви хочете зареєструвати нову адресу?" },
      { role: "user", content: "Так, я щойно переїхав." },
    ];

    const conversationResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Так, я щойно переїхав.",
        location: { countryCode: "DE", city: "Mayen" },
        language: "uk",
        conversation,
      }),
    });

    assert.equal(conversationResponse.status, 200);
    assert.equal(receivedConversation.length, 3);
    assert.deepEqual(receivedConversation, conversation);

    console.log("✓ Conversation history preserved");

    // Test 8: Correction needed
    mockResponse = {
      status: "correction_needed",
      language: "uk",
      message: "Потрібно уточнити інформацію.",
    };

    const correctionResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Хочу виправити дані.",
        location: { countryCode: "DE", city: "Mayen" },
        language: "uk",
      }),
    });

    assert.equal(correctionResponse.status, 200);

    const correctionResult = await correctionResponse.json();

    assert.equal(correctionResult.status, "correction_needed");

    console.log("✓ Correction needed response");

    // Test 9: Assistant service error
    mockError = new Error("Simulated AI failure");

    const errorResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Тест помилки AI.",
        location: { countryCode: "DE", city: "Mayen" },
        language: "uk",
      }),
    });

    assert.equal(errorResponse.status, 500);

    const errorResult = await errorResponse.json();

    assert.equal(errorResult.error, "Failed to process assistant request");

    mockError = null;

    console.log("✓ Assistant service error handling");
    console.log("\nAll Assistant API tests passed!");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
};

runTests().catch((error: unknown) => {
  console.error("Assistant API tests failed:", error);
  throw error;
});
