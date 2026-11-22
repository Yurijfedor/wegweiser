import assert from "node:assert/strict";
import OpenAI from "openai";

import { createOpenAIDiscoverySourceProvider } from "../src/services/discovery/openAiDiscoverySourceProvider";

const createMockOpenAI = (output: unknown[]) => {
  let receivedRequest: Record<string, unknown> | undefined;

  const mock = {
    responses: {
      create: async (request: Record<string, unknown>) => {
        receivedRequest = request;

        return {
          output,
        };
      },
    },
  } as unknown as OpenAI;

  return {
    mock,
    getRequest: () => receivedRequest,
  };
};

const runTests = async () => {
  console.log("Testing Discovery Source Provider...\n");

  // Test 1: Valid search results
  {
    const { mock } = createMockOpenAI([
      {
        type: "web_search_call",
        results: [
          {
            title: "Stadt Mayen",
            url: "https://www.mayen.de",
            snippet: "Official city website",
          },
          {
            title: "Bundesportal",
            url: "https://verwaltung.bund.de",
            snippet: "Administrative services",
          },
        ],
      },
    ]);

    const provider = createOpenAIDiscoverySourceProvider(mock);

    const results = await provider.search({
      query: "Wohnsitz anmelden",
      countryCode: "DE",
      region: "Rheinland-Pfalz",
      city: "Mayen",
    });

    assert.equal(results.length, 2);
    assert.equal(results[0].title, "Stadt Mayen");
    assert.equal(results[0].authority, "www.mayen.de");
    assert.equal(results[0].snippet, "Official city website");

    console.log("✓ Valid search results");
  }

  // Test 2: Invalid URLs are rejected
  {
    const { mock } = createMockOpenAI([
      {
        type: "web_search_call",
        results: [
          {
            title: "Valid",
            url: "https://www.mayen.de",
          },
          {
            title: "Invalid protocol",
            url: "javascript:alert(1)",
          },
          {
            title: "Invalid URL",
            url: "not-a-url",
          },
          {
            title: "Missing URL",
          },
        ],
      },
    ]);

    const provider = createOpenAIDiscoverySourceProvider(mock);

    const results = await provider.search({
      query: "Wohnsitz anmelden",
      countryCode: "DE",
    });

    assert.equal(results.length, 1);
    assert.equal(results[0].url, "https://www.mayen.de");

    console.log("✓ Invalid URLs rejected");
  }

  // Test 3: Duplicate URLs are removed
  {
    const { mock } = createMockOpenAI([
      {
        type: "web_search_call",
        results: [
          {
            title: "First result",
            url: "https://www.mayen.de",
          },
          {
            title: "Duplicate result",
            url: "https://www.mayen.de",
          },
        ],
      },
    ]);

    const provider = createOpenAIDiscoverySourceProvider(mock);

    const results = await provider.search({
      query: "Wohnsitz anmelden",
      countryCode: "DE",
    });

    assert.equal(results.length, 1);
    assert.equal(results[0].title, "First result");

    console.log("✓ Duplicate URLs removed");
  }

  // Test 4: Missing search results return an empty array
  {
    const { mock } = createMockOpenAI([]);

    const provider = createOpenAIDiscoverySourceProvider(mock);

    const results = await provider.search({
      query: "Wohngeld beantragen",
      countryCode: "DE",
    });

    assert.deepEqual(results, []);

    console.log("✓ Empty search results handled");
  }

  // Test 5: Web search is required
  {
    const { mock, getRequest } = createMockOpenAI([]);

    const provider = createOpenAIDiscoverySourceProvider(mock);

    await provider.search({
      query: "Wohnsitz anmelden",
      countryCode: "DE",
    });

    const request = getRequest();

    assert.ok(request);
    assert.equal(request.tool_choice, "required");
    assert.deepEqual(request.include, ["web_search_call.results"]);

    console.log("✓ Web search configuration");
  }

  console.log("\nAll Discovery Source Provider tests passed!");
};

runTests().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
