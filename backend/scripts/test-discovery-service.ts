import assert from "node:assert/strict";

import { createDiscoveryService } from "../src/services/discovery/discoveryService";

// import { createInMemoryDiscoveryRepository } from "../src/services/discovery/discoveryRepository";

import type { DiscoveryCandidate } from "../src/services/discovery/discoveryCandidate";

import type { DiscoverySourceProvider } from "../src/services/discovery/discoverySourceProvider";

import type { DiscoveryCandidateGenerator } from "../src/services/discovery/discoveryCandidateGenerator";

import type { DiscoveryRepository } from "../src/services/discovery/discoveryRepository";

const validGeneratedCandidate = {
  procedure: {
    categoryId: "wohnen",
    title: "Besondere kommunale Genehmigung beantragen",
    description:
      "Ein eigenständiges Verwaltungsverfahren für eine spezielle kommunale Genehmigung.",
    region: "Mayen, Rheinland-Pfalz",
    deadline: "Innerhalb von zwei Wochen nach dem Einzug.",
    authority: {
      name: "Stadtverwaltung Mayen",
    },
    sources: [
      {
        title: "Stadt Mayen",
        url: "https://www.mayen.de",
        authority: "www.mayen.de",
      },
    ],
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
          },
        ],
      },
    ],
  },
  scope: "local" as const,
  location: {
    countryCode: "DE",
    region: "Rheinland-Pfalz",
    city: "Mayen",
  },
  originalQuery: "Besondere kommunale Genehmigung beantragen",
};

const validSources = [
  {
    title: "Stadt Mayen",
    url: "https://www.mayen.de",
    authority: "www.mayen.de",
    snippet: "Informationen zur Wohnsitzanmeldung.",
  },
];

const validConversation = [
  {
    role: "user" as const,
    content: "Ich bin nach Mayen gezogen.",
  },
  {
    role: "user" as const,
    content: "Wie kann ich eine besondere kommunale Genehmigung beantragen?",
  },
];

const createMockDependencies = (
  options: {
    sources?: typeof validSources;
    generated?: typeof validGeneratedCandidate;
    sourceError?: Error;
    generatorError?: Error;
    initialCandidates?: DiscoveryCandidate[];
  } = {},
) => {
  let receivedSourceQuery:
    | Parameters<DiscoverySourceProvider["search"]>[0]
    | undefined;

  let receivedGenerationInput:
    | Parameters<DiscoveryCandidateGenerator["generate"]>[0]
    | undefined;

  const savedCandidates: DiscoveryCandidate[] = [
    ...(options.initialCandidates ?? []).map((candidate) =>
      structuredClone(candidate),
    ),
  ];

  const repository: DiscoveryRepository = {
    async add(candidate) {
      if (savedCandidates.some((item) => item.id === candidate.id)) {
        throw new Error(`Candidate already exists: ${candidate.id}`);
      }

      savedCandidates.push(structuredClone(candidate));
    },

    async getById(id) {
      const candidate = savedCandidates.find((item) => item.id === id);
      return candidate ? structuredClone(candidate) : null;
    },

    async getAll() {
      return structuredClone(savedCandidates);
    },

    async updateStatus(id, status) {
      const candidate = savedCandidates.find((item) => item.id === id);
      if (!candidate) return null;

      candidate.status = status;

      return structuredClone(candidate);
    },
  };

  const sourceProvider: DiscoverySourceProvider = {
    async search(input) {
      receivedSourceQuery = input;

      if (options.sourceError) {
        throw options.sourceError;
      }

      return options.sources ?? validSources;
    },
  };

  const candidateGenerator: DiscoveryCandidateGenerator = {
    async generate(input) {
      receivedGenerationInput = input;

      if (options.generatorError) {
        throw options.generatorError;
      }

      return options.generated ?? validGeneratedCandidate;
    },
  };

  return {
    dependencies: {
      sourceProvider,
      candidateGenerator,
      repository,
    },
    getSourceQuery: () => receivedSourceQuery,
    getGenerationInput: () => receivedGenerationInput,
    getSavedCandidates: () => savedCandidates,
  };
};

const runTests = async () => {
  console.log("Testing Discovery Service...\n");

  // Test 1: Candidate is successfully created
  {
    const mocks = createMockDependencies();

    const service = createDiscoveryService(mocks.dependencies);

    const result = await service.discover({
      conversation: validConversation,
      location: {
        countryCode: "DE",
        city: "Mayen",
        region: "Rheinland-Pfalz",
      },
    });

    assert.equal(result.status, "candidate_created");

    if (result.status === "candidate_created") {
      assert.ok(result.candidateId);
    }

    assert.equal(mocks.getSavedCandidates().length, 1);

    const saved = mocks.getSavedCandidates()[0];

    assert.equal(saved.status, "pending_review");
    assert.equal(saved.discoveredBy, "ai");
    assert.equal(
      saved.procedure.title,
      "Besondere kommunale Genehmigung beantragen",
    );

    console.log("✓ Candidate successfully created");
  }

  // Test 2: Duplicate in the procedure catalog is detected
  {
    const catalogDuplicateCandidate = {
      ...validGeneratedCandidate,
      procedure: {
        ...validGeneratedCandidate.procedure,
        title: "Wohnsitz anmelden",
      },
    };

    const mocks = createMockDependencies({
      generated: catalogDuplicateCandidate,
    });

    const service = createDiscoveryService(mocks.dependencies);

    const result = await service.discover({
      conversation: validConversation,
      location: {
        countryCode: "DE",
        city: "Mayen",
        region: "Rheinland-Pfalz",
      },
    });

    assert.deepEqual(result, {
      status: "duplicate_found",
      duplicateOf: "wohnsitz-anmelden",
      duplicateType: "catalog",
    });

    assert.equal(mocks.getSavedCandidates().length, 0);

    console.log("✓ Duplicate in catalog detected");
  }

  // Test 2: No sources found
  {
    const mocks = createMockDependencies({
      sources: [],
    });

    const service = createDiscoveryService(mocks.dependencies);

    const result = await service.discover({
      conversation: validConversation,
      location: {
        countryCode: "DE",
        city: "Mayen",
      },
    });

    assert.deepEqual(result, {
      status: "not_found",
    });

    assert.equal(mocks.getSavedCandidates().length, 0);
    assert.equal(mocks.getGenerationInput(), undefined);

    console.log("✓ No sources handled");
  }

  // Test 3: Empty conversation is rejected
  {
    const mocks = createMockDependencies();

    const service = createDiscoveryService(mocks.dependencies);

    await assert.rejects(
      () =>
        service.discover({
          conversation: [],
          location: {
            countryCode: "DE",
            city: "Mayen",
          },
        }),
      /at least one user message/,
    );

    assert.equal(mocks.getSavedCandidates().length, 0);

    console.log("✓ Empty conversation rejected");
  }

  // Test 4: Invalid candidate is not saved
  {
    const invalidGenerated = {
      ...validGeneratedCandidate,
      procedure: {
        ...validGeneratedCandidate.procedure,
        categoryId: "unknown-category",
      },
    };

    const mocks = createMockDependencies({
      generated: invalidGenerated,
    });

    const service = createDiscoveryService(mocks.dependencies);

    await assert.rejects(
      () =>
        service.discover({
          conversation: validConversation,
          location: {
            countryCode: "DE",
            city: "Mayen",
          },
        }),
      /validation failed/,
    );

    assert.equal(mocks.getSavedCandidates().length, 0);

    console.log("✓ Invalid candidate rejected");
  }

  // Test 5: Conversation context is preserved
  {
    const mocks = createMockDependencies();

    const service = createDiscoveryService(mocks.dependencies);

    await service.discover({
      conversation: validConversation,
      location: {
        countryCode: "DE",
        city: "Mayen",
        region: "Rheinland-Pfalz",
      },
    });

    const query = mocks.getSourceQuery();

    assert.ok(query);
    assert.match(query.query, /Ich bin nach Mayen gezogen/);
    assert.match(query.query, /besondere kommunale Genehmigung beantragen/);
    assert.equal(query.countryCode, "DE");
    assert.equal(query.city, "Mayen");
    assert.equal(query.region, "Rheinland-Pfalz");

    console.log("✓ Conversation context preserved");
  }

  // Test 6: Generator errors are propagated
  {
    const mocks = createMockDependencies({
      generatorError: new Error("Simulated generator failure"),
    });

    const service = createDiscoveryService(mocks.dependencies);

    await assert.rejects(
      () =>
        service.discover({
          conversation: validConversation,
          location: {
            countryCode: "DE",
            city: "Mayen",
          },
        }),
      /Simulated generator failure/,
    );

    assert.equal(mocks.getSavedCandidates().length, 0);

    console.log("✓ Generator errors propagated");
  }

  // Test 7: Source provider errors are propagated
  {
    const mocks = createMockDependencies({
      sourceError: new Error("Simulated source failure"),
    });

    const service = createDiscoveryService(mocks.dependencies);

    await assert.rejects(
      () =>
        service.discover({
          conversation: validConversation,
          location: {
            countryCode: "DE",
            city: "Mayen",
          },
        }),
      /Simulated source failure/,
    );

    assert.equal(mocks.getSavedCandidates().length, 0);

    console.log("✓ Source provider errors propagated");
  }

  // Test 9: Duplicate among existing candidates is detected
  {
    const existingCandidate: DiscoveryCandidate = {
      ...validGeneratedCandidate,
      id: "existing-candidate-001",
      createdAt: new Date().toISOString(),
      status: "pending_review",
      discoveredBy: "ai",
    };

    const mocks = createMockDependencies({
      initialCandidates: [existingCandidate],
    });

    const service = createDiscoveryService(mocks.dependencies);

    const result = await service.discover({
      conversation: validConversation,
      location: {
        countryCode: "DE",
        city: "Mayen",
        region: "Rheinland-Pfalz",
      },
    });

    assert.deepEqual(result, {
      status: "duplicate_found",
      duplicateOf: "existing-candidate-001",
      duplicateType: "candidate",
    });

    assert.equal(mocks.getSavedCandidates().length, 1);

    console.log("✓ Duplicate among pending candidates detected");
  }

  console.log("\nAll Discovery Service tests passed!");
};

runTests().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
