import assert from "node:assert/strict";

import { createApp } from "../src/app";
import { createAssistantRouter } from "../src/routes/assistant";

import type {
  DiscoveryService,
  DiscoveryServiceResult,
} from "../src/services/discovery/discoveryService";

import type { IntentClassifier } from "../src/services/assistant/intentClassifier";

import type {
  ConversationMessage,
  ProcedureMatch,
} from "../src/types/assistant";
// import { LiveEmitter } from "openai/resources/live/internal-base.js";
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

  let assistantServiceCalls = 0;

  let discoveryServiceCalls = 0;

  let mockDiscoveryResult: DiscoveryServiceResult = {
    status: "not_found",
  };

  const mockDiscoveredProcedure = {
    categoryId: "wohnen",
    title: "Besondere kommunale Genehmigung beantragen",
    description: "Ein neues kommunales Verwaltungsverfahren.",
    region: "Mayen, Rheinland-Pfalz",
    sources: [
      {
        title: "Stadt Mayen",
        url: "https://www.mayen.de",
        authority: "www.mayen.de",
      },
    ],
    steps: [
      {
        id: "antrag",
        title: "Antrag vorbereiten",
        description: "Erforderliche Unterlagen zusammenstellen.",
        documents: [
          {
            id: "ausweis",
            title: "Personalausweis",
            description: "Gültiges Ausweisdokument.",
            required: true,
          },
        ],
      },
    ],
    verification: {
      status: "unverified" as const,
    },
  };

  let mockDiscoveryError: Error | null = null;

  const mockDiscoveryService: DiscoveryService = {
    async discover() {
      discoveryServiceCalls++;

      if (mockDiscoveryError) {
        throw mockDiscoveryError;
      }

      return mockDiscoveryResult;
    },
  };

  const mockAssistant = async (
    language: string,
    conversation: ConversationMessage[],
  ) => {
    assistantServiceCalls++;
    receivedLanguage = language;
    receivedConversation = conversation;
    if (mockError) {
      throw mockError;
    }

    return mockResponse;
  };

  let mockIntent: "administrative" | "out_of_scope" | "ambiguous" =
    "administrative";

  let intentClassifierCalls = 0;

  const mockIntentClassifier: IntentClassifier = async () => {
    intentClassifierCalls++;

    return {
      intent: mockIntent,
      reason: "Mock intent classification",
    };
  };

  const app = createApp(
    createAssistantRouter(
      mockAssistant,
      mockIntentClassifier,
      mockDiscoveryService,
    ),
  );
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
    assert.equal(discoveryServiceCalls, 0);

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
    assert.equal(discoveryServiceCalls, 0);

    console.log("✓ Clarification response");

    // Test 6: Not supported
    mockResponse = {
      status: "not_supported",
      language: "uk",
      message: "На жаль, ця процедура поки не підтримується.",
    };

    mockDiscoveryResult = {
      status: "not_found",
    };

    const discoveryCallsBefore = discoveryServiceCalls;

    const unsupportedResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Хочу оформити спеціальний дозвіл у міській адміністрації.",
        location: { countryCode: "DE", city: "Mayen" },
        language: "uk",
      }),
    });

    assert.equal(unsupportedResponse.status, 200);

    const unsupportedResult = await unsupportedResponse.json();

    assert.equal(unsupportedResult.status, "not_supported");
    assert.equal(discoveryServiceCalls, discoveryCallsBefore + 1);

    console.log("✓ Not supported response and Discovery fallback");

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

    // Test 10: Out-of-scope request
    mockIntent = "out_of_scope";

    const callsBeforeOutOfScope = intentClassifierCalls;
    const assistantCallsBeforeOutOfScope = assistantServiceCalls;

    const outOfScopeResponse = await fetch(`${baseUrl}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Wo kann ich Pizza kaufen?",
        location: { countryCode: "DE", city: "Mayen" },
        language: "de",
      }),
    });

    assert.equal(outOfScopeResponse.status, 200);

    const outOfScopeResult = await outOfScopeResponse.json();

    assert.equal(outOfScopeResult.status, "out_of_scope");
    assert.equal(intentClassifierCalls, callsBeforeOutOfScope + 1);
    assert.equal(assistantServiceCalls, assistantCallsBeforeOutOfScope);

    console.log("✓ Out-of-scope request stops before assistant service");

    // Test 11: Discovery successfully returns a new procedure
    {
      mockIntent = "administrative";

      mockResponse = {
        status: "not_supported",
        language: "uk",
        message: "Процедуру не знайдено в каталозі.",
      };

      mockDiscoveryResult = {
        status: "candidate_created",
        candidateId: "candidate-001",
        candidate: {
          id: "candidate-001",
          procedure: mockDiscoveredProcedure,
          scope: "local",
          location: {
            countryCode: "DE",
            region: "Rheinland-Pfalz",
            city: "Mayen",
          },
          originalQuery: "Besondere kommunale Genehmigung beantragen",
          discoveredBy: "ai",
          createdAt: "2026-11-22T12:00:00.000Z",
          status: "pending_review",
        },
      };

      const discoveredResponse = await fetch(`${baseUrl}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Хочу оформити спеціальний дозвіл у міській адміністрації.",
          location: { countryCode: "DE", city: "Mayen" },
          language: "uk",
        }),
      });

      assert.equal(discoveredResponse.status, 200);

      const discoveredResult = await discoveredResponse.json();

      assert.equal(discoveredResult.status, "discovered");
      assert.equal(discoveredResult.verificationStatus, "unverified");
      assert.equal(
        discoveredResult.discoveredProcedure.title,
        "Besondere kommunale Genehmigung beantragen",
      );
      assert.equal(discoveredResult.discoveredProcedure.steps.length, 1);
      assert.equal(discoveredResult.discoveredProcedure.sources.length, 1);

      console.log("✓ Discovery returns a complete unverified procedure");
    }

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
