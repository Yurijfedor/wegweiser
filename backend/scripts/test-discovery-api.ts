import assert from "node:assert/strict";
import express from "express";

import { createDiscoveryRouter } from "../src/routes/discovery";
import { createInMemoryDiscoveryRepository } from "../src/services/discovery/inMemoryDiscoveryRepository";

import type { DiscoveryCandidate } from "../src/services/discovery/discoveryCandidate";

const runTests = async () => {
  const repository = createInMemoryDiscoveryRepository();

  const candidate: DiscoveryCandidate = {
    id: "candidate-test-001",
    procedure: {
      categoryId: "alltag",
      title: "Testverfahren beantragen",
      description: "Ein Testverfahren für die API.",
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
          id: "step-1",
          title: "Antrag vorbereiten",
          description: "Bereiten Sie den Antrag vor.",
          documents: [],
        },
      ],
      verification: {
        status: "unverified",
      },
    },
    scope: "local",
    location: {
      countryCode: "DE",
      region: "Rheinland-Pfalz",
      city: "Mayen",
    },
    originalQuery: "Testverfahren beantragen",
    discoveredBy: "ai",
    createdAt: "2026-11-24T12:00:00.000Z",
    status: "pending_review",
  };

  await repository.add(candidate);

  const app = express();
  app.use("/api/discovery", createDiscoveryRouter(repository));

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
    console.log("Testing Discovery API...\n");

    // Test 1: Existing candidate
    const response = await fetch(
      `${baseUrl}/api/discovery/candidates/${candidate.id}`,
    );

    assert.equal(response.status, 200);

    const result = await response.json();

    assert.deepEqual(result.candidate, candidate);

    console.log("✓ Existing candidate retrieved");

    // Test 2: Unknown candidate
    const notFoundResponse = await fetch(
      `${baseUrl}/api/discovery/candidates/unknown-id`,
    );

    assert.equal(notFoundResponse.status, 404);

    const notFoundResult = await notFoundResponse.json();

    assert.equal(notFoundResult.error, "Discovery candidate not found");

    console.log("✓ Unknown candidate returns 404");

    console.log("\nAll Discovery API tests passed!");
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
  console.error("Discovery API tests failed:", error);
  process.exitCode = 1;
});
