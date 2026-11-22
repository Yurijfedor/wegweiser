import "dotenv/config";

import { createOpenAIDiscoverySourceProvider } from "../src/services/discovery/openAiDiscoverySourceProvider";

const run = async () => {
  console.log("Testing Discovery Source Provider with real API...\n");

  const provider = createOpenAIDiscoverySourceProvider();

  const results = await provider.search({
    query: "Wohnsitz anmelden",
    countryCode: "DE",
    region: "Rheinland-Pfalz",
    city: "Mayen",
  });

  console.log(`Received ${results.length} sources:\n`);

  for (const [index, result] of results.entries()) {
    console.log(`${index + 1}. ${result.title}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Authority: ${result.authority}`);
    console.log(`   Snippet: ${result.snippet ?? "N/A"}\n`);
  }

  if (results.length === 0) {
    throw new Error("Provider returned no sources.");
  }

  console.log("Live provider test completed successfully.");
};

run().catch((error: unknown) => {
  console.error("Live provider test failed:", error);
  process.exitCode = 1;
});
