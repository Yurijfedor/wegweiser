import assert from "node:assert/strict";
import OpenAI from "openai";

import { createOpenAIDiscoveryCandidateGenerator } from "../src/services/discovery/openAiDiscoveryCandidateGenerator";

const validCandidate = {
  categoryId: "wohnen",
  title: "Wohnsitz anmelden",
  description: "Anmeldung eines neuen Wohnsitzes.",
  region: "Mayen, Rheinland-Pfalz",
  deadline: "Innerhalb von zwei Wochen nach dem Einzug.",
  authority: {
    name: "Stadtverwaltung Mayen",
    address: null,
    phone: null,
    email: null,
    website: null,
  },
  steps: [
    {
      id: "anmeldung",
      title: "Anmeldung vorbereiten",
      description: "Erforderliche Unterlagen zusammenstellen.",
      documents: [
        {
          id: "personalausweis",
          title: "Personalausweis",
          description: "Gültiges Ausweisdokument.",
          required: true,
          condition: null,
        },
      ],
    },
  ],
  scope: "local" as const,
  location: {
    countryCode: "DE",
    region: "Rheinland-Pfalz",
    city: "Mayen",
  },
  baseProcedureId: null,
  duplicateOf: null,
  sourceUrls: ["https://www.mayen.de"],
};

const createMockOpenAI = (outputText: string, status = "completed") => {
  let receivedRequest: Record<string, unknown> | undefined;

  const mock = {
    responses: {
      create: async (request: Record<string, unknown>) => {
        receivedRequest = request;

        return {
          status,
          output_text: outputText,
        };
      },
    },
  } as unknown as OpenAI;

  return {
    mock,
    getRequest: () => receivedRequest,
  };
};

const createInput = () => ({
  query: {
    query: "Wohnsitz anmelden",
    countryCode: "DE",
    region: "Rheinland-Pfalz",
    city: "Mayen",
  },
  sources: [
    {
      title: "Stadt Mayen",
      url: "https://www.mayen.de",
      authority: "www.mayen.de",
      snippet: "Informationen zur Wohnsitzanmeldung.",
    },
  ],
});

const runTests = async () => {
  console.log("Testing Discovery Candidate Generator...\n");

  // Test 1: Valid candidate is generated
  {
    const { mock, getRequest } = createMockOpenAI(
      JSON.stringify(validCandidate),
    );

    const generator = createOpenAIDiscoveryCandidateGenerator(mock);

    const result = await generator.generate(createInput());

    assert.equal(result.procedure.categoryId, "wohnen");
    assert.equal(result.procedure.title, "Wohnsitz anmelden");
    assert.equal(result.procedure.sources?.length, 1);
    assert.equal(result.procedure.sources?.[0].url, "https://www.mayen.de");
    assert.equal(result.originalQuery, "Wohnsitz anmelden");

    const request = getRequest();

    assert.ok(request);

    console.log("✓ Valid candidate generated");
  }

  // Test 2: Unknown category is rejected
  {
    const invalidCandidate = {
      ...validCandidate,
      categoryId: "unknown-category",
    };

    const { mock } = createMockOpenAI(JSON.stringify(invalidCandidate));

    const generator = createOpenAIDiscoveryCandidateGenerator(mock);

    await assert.rejects(
      () => generator.generate(createInput()),
      /unknown procedure category/,
    );

    console.log("✓ Unknown category rejected");
  }

  // Test 3: Unknown source URL is rejected
  {
    const invalidCandidate = {
      ...validCandidate,
      sourceUrls: ["https://unknown.example.com"],
    };

    const { mock } = createMockOpenAI(JSON.stringify(invalidCandidate));

    const generator = createOpenAIDiscoveryCandidateGenerator(mock);

    await assert.rejects(
      () => generator.generate(createInput()),
      /unknown source/,
    );

    console.log("✓ Unknown source URL rejected");
  }

  // Test 4: Empty input sources are rejected
  {
    const { mock } = createMockOpenAI(JSON.stringify(validCandidate));

    const generator = createOpenAIDiscoveryCandidateGenerator(mock);

    await assert.rejects(
      () =>
        generator.generate({
          ...createInput(),
          sources: [],
        }),
      /without sources/,
    );

    console.log("✓ Empty input sources rejected");
  }

  // Test 5: Empty AI response is rejected
  {
    const { mock } = createMockOpenAI("");

    const generator = createOpenAIDiscoveryCandidateGenerator(mock);

    await assert.rejects(
      () => generator.generate(createInput()),
      /empty candidate response/,
    );

    console.log("✓ Empty AI response rejected");
  }

  // Test 6: Invalid JSON is rejected
  {
    const { mock } = createMockOpenAI("{ invalid json");

    const generator = createOpenAIDiscoveryCandidateGenerator(mock);

    await assert.rejects(
      () => generator.generate(createInput()),
      /invalid candidate JSON/,
    );

    console.log("✓ Invalid JSON rejected");
  }

  // Test 7: Incomplete OpenAI response is rejected
  {
    const { mock } = createMockOpenAI(
      JSON.stringify(validCandidate),
      "incomplete",
    );

    const generator = createOpenAIDiscoveryCandidateGenerator(mock);

    await assert.rejects(
      () => generator.generate(createInput()),
      /did not complete/,
    );

    console.log("✓ Incomplete OpenAI response rejected");
  }

  console.log("\nAll Discovery Candidate Generator tests passed!");
};

runTests().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
