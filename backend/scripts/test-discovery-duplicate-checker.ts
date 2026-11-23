import assert from "node:assert/strict";

import { createDiscoveryDuplicateChecker } from "../src/services/discovery/discoveryDuplicateChecker";

import { createInMemoryDiscoveryRepository } from "../src/services/discovery/inMemoryDiscoveryRepository";
import type { DiscoveryCandidate } from "../src/services/discovery/discoveryCandidate";

const createCandidate = (
  overrides: Partial<DiscoveryCandidate> = {},
): DiscoveryCandidate => ({
  id: "candidate-new",
  procedure: {
    categoryId: "wohnen",
    title: "Neuen Wohnprozess beantragen",
    description: "Ein neuer administrativer Vorgang für Bürger.",
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
        description: "Unterlagen zusammenstellen.",
        documents: [],
      },
    ],
  },
  scope: "local",
  location: {
    countryCode: "DE",
    region: "Rheinland-Pfalz",
    city: "Mayen",
  },
  originalQuery: "Neuen Wohnprozess beantragen",
  discoveredBy: "ai",
  createdAt: new Date().toISOString(),
  status: "pending_review",
  ...overrides,
});

const runTests = async () => {
  console.log("Testing Discovery Duplicate Checker...\n");

  // Test 1: Existing catalog procedure is detected
  {
    const repository = createInMemoryDiscoveryRepository();
    const checker = createDiscoveryDuplicateChecker(repository);

    const candidate = createCandidate({
      procedure: {
        ...createCandidate().procedure,
        title: "Wohnsitz anmelden",
        description: "Anmeldung eines neuen Wohnsitzes.",
      },
    });

    const result = await checker.check(candidate);

    assert.deepEqual(result, {
      isDuplicate: true,
      duplicateOf: "wohnsitz-anmelden",
      reason: "catalog",
    });

    console.log("✓ Existing catalog procedure detected");
  }

  // Test 2: Existing pending candidate is detected
  {
    const repository = createInMemoryDiscoveryRepository();

    const existing = createCandidate({
      id: "candidate-existing",
      procedure: {
        ...createCandidate().procedure,
        title: "Neuen Wohnprozess beantragen",
        description: "Ein neuer administrativer Vorgang für Bürger.",
      },
      status: "pending_review",
    });

    await repository.add(existing);

    const checker = createDiscoveryDuplicateChecker(repository);

    const candidate = createCandidate({
      procedure: {
        ...createCandidate().procedure,
        title: "Neuen Wohnprozess beantragen",
        description: "Ein neuer administrativer Vorgang für Bürger.",
      },
    });

    const result = await checker.check(candidate);

    assert.deepEqual(result, {
      isDuplicate: true,
      duplicateOf: "candidate-existing",
      reason: "candidate",
    });

    console.log("✓ Existing pending candidate detected");
  }

  // Test 3: Existing approved candidate is detected
  {
    const repository = createInMemoryDiscoveryRepository();

    await repository.add(
      createCandidate({
        id: "candidate-approved",
        status: "approved",
      }),
    );

    const checker = createDiscoveryDuplicateChecker(repository);

    const result = await checker.check(createCandidate());

    assert.deepEqual(result, {
      isDuplicate: true,
      duplicateOf: "candidate-approved",
      reason: "candidate",
    });

    console.log("✓ Existing approved candidate detected");
  }

  // Test 4: Rejected candidates are ignored
  {
    const repository = createInMemoryDiscoveryRepository();

    await repository.add(
      createCandidate({
        id: "candidate-rejected",
        status: "rejected",
      }),
    );

    const checker = createDiscoveryDuplicateChecker(repository);

    const result = await checker.check(createCandidate());

    assert.deepEqual(result, {
      isDuplicate: false,
    });

    console.log("✓ Rejected candidates ignored");
  }

  // Test 5: Different categories are not considered duplicates
  {
    const repository = createInMemoryDiscoveryRepository();

    await repository.add(
      createCandidate({
        id: "candidate-family",
        procedure: {
          ...createCandidate().procedure,
          categoryId: "familie",
        },
      }),
    );

    const checker = createDiscoveryDuplicateChecker(repository);

    const result = await checker.check(createCandidate());

    assert.deepEqual(result, {
      isDuplicate: false,
    });

    console.log("✓ Different categories are not duplicates");
  }

  // Test 6: Different procedures are not considered duplicates
  {
    const repository = createInMemoryDiscoveryRepository();
    const checker = createDiscoveryDuplicateChecker(repository);

    const result = await checker.check(createCandidate());

    assert.deepEqual(result, {
      isDuplicate: false,
    });

    console.log("✓ Different procedures are not duplicates");
  }

  // Test 7: Rejected duplicate candidate does not match itself
  {
    const repository = createInMemoryDiscoveryRepository();

    await repository.add(
      createCandidate({
        id: "candidate-old",
        status: "duplicate",
      }),
    );

    const checker = createDiscoveryDuplicateChecker(repository);

    const result = await checker.check(createCandidate());

    assert.deepEqual(result, {
      isDuplicate: false,
    });

    console.log("✓ Duplicate candidates are ignored");
  }

  console.log("\nAll Discovery Duplicate Checker tests passed!");
};

runTests().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
