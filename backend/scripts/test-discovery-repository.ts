import assert from "node:assert/strict";
import { createInMemoryDiscoveryRepository } from "../src/services/discovery/inMemoryDiscoveryRepository";
import type { DiscoveryCandidate } from "../src/services/discovery/discoveryCandidate";

const createCandidate = (id: string): DiscoveryCandidate => ({
  id,

  procedure: {
    categoryId: "wohnen",
    title: `Test procedure ${id}`,
    description: "Test administrative procedure",
    region: "Deutschland",

    steps: [
      {
        id: "documents",
        title: "Prepare documents",
        description: "Prepare the required documents.",
        documents: [
          {
            id: "identity",
            title: "Identity document",
            description: "Valid identity document.",
            required: true,
          },
        ],
      },
    ],

    sources: [
      {
        title: "Official source",
        url: "https://www.example.de",
        authority: "Test authority",
      },
    ],
  },

  scope: "national",

  location: {
    countryCode: "DE",
  },

  originalQuery: "Test query",
  status: "pending_review",
  discoveredBy: "ai",
  createdAt: "2026-11-22T10:00:00.000Z",
});

const runTests = async () => {
  const repository = createInMemoryDiscoveryRepository();

  // 1. Add and retrieve candidate
  const candidate = createCandidate("candidate-001");

  await repository.add(candidate);

  const saved = await repository.getById(candidate.id);

  assert.deepEqual(saved, candidate);
  console.log("✓ adds and retrieves a candidate");

  // 2. Reject duplicate ID
  await assert.rejects(() => repository.add(candidate), /already exists/);

  console.log("✓ rejects duplicate candidate IDs");

  // 3. Return null for unknown ID
  const missing = await repository.getById("unknown-id");

  assert.equal(missing, null);
  console.log("✓ returns null for unknown ID");

  // 4. Get all candidates
  await repository.add(createCandidate("candidate-002"));

  const all = await repository.getAll();

  assert.equal(all.length, 2);
  console.log("✓ returns all candidates");

  // 5. Update candidate status
  const updated = await repository.updateStatus("candidate-001", "approved");

  assert.equal(updated?.status, "approved");
  console.log("✓ updates candidate status");

  // 6. Unknown candidate cannot be updated
  const unknownUpdate = await repository.updateStatus("unknown-id", "rejected");

  assert.equal(unknownUpdate, null);
  console.log("✓ returns null when updating unknown candidate");

  // 7. Returned objects cannot mutate stored data
  const retrieved = await repository.getById("candidate-001");

  assert.ok(retrieved);

  retrieved.procedure.title = "Modified outside repository";

  const unchanged = await repository.getById("candidate-001");

  assert.equal(unchanged?.procedure.title, "Test procedure candidate-001");

  console.log("✓ protects stored data from external mutation");

  console.log("\n7/7 tests passed.");
};

runTests().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
