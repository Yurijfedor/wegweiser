import assert from "node:assert/strict";
import { validateDiscoveryCandidate } from "../src/services/discovery/discoveryValidator";

const validCandidate = {
  id: "candidate-001",

  procedure: {
    categoryId: "wohnen",
    title: "Wohnsitz anmelden",
    description:
      "Melde deine neue Wohnung bei der zuständigen Meldebehörde an.",
    region: "Deutschland",
    deadline: "Innerhalb von zwei Wochen nach dem Einzug.",

    authority: {
      name: "Einwohnermeldeamt",
      website: "https://www.example.de",
    },

    steps: [
      {
        id: "documents",
        title: "Unterlagen vorbereiten",
        description: "Bereite die erforderlichen Dokumente vor.",
        documents: [
          {
            id: "identity",
            title: "Personalausweis oder Reisepass",
            description: "Ein gültiges Identitätsdokument.",
            required: true,
          },
        ],
      },
    ],

    sources: [
      {
        title: "Wohnsitz anmelden",
        url: "https://www.example.de/wohnsitz",
        authority: "Stadtverwaltung",
      },
    ],
  },

  scope: "national" as const,

  location: {
    countryCode: "DE",
  },

  originalQuery: "Wie kann ich meinen Wohnsitz anmelden?",
  discoveredBy: "ai" as const,
  createdAt: "2026-11-22T10:00:00.000Z",
  status: "pending_review" as const,
};

const tests = [
  {
    name: "accepts a valid national candidate",
    candidate: validCandidate,
    expected: true,
  },
  {
    name: "accepts a valid state candidate",
    candidate: {
      ...validCandidate,
      scope: "state",
      location: {
        countryCode: "DE",
        region: "Rheinland-Pfalz",
      },
    },
    expected: true,
  },
  {
    name: "accepts a valid local candidate",
    candidate: {
      ...validCandidate,
      scope: "local",
      location: {
        countryCode: "DE",
        region: "Rheinland-Pfalz",
        city: "Mayen",
      },
    },
    expected: true,
  },
  {
    name: "rejects an empty candidate ID",
    candidate: { ...validCandidate, id: "" },
    expected: false,
  },
  {
    name: "rejects a missing procedure",
    candidate: { ...validCandidate, procedure: undefined },
    expected: false,
  },
  {
    name: "rejects a missing procedure title",
    candidate: {
      ...validCandidate,
      procedure: { ...validCandidate.procedure, title: "" },
    },
    expected: false,
  },
  {
    name: "rejects an invalid scope",
    candidate: { ...validCandidate, scope: "city" },
    expected: false,
  },
  {
    name: "rejects a state candidate without region",
    candidate: {
      ...validCandidate,
      scope: "state",
      location: { countryCode: "DE" },
    },
    expected: false,
  },
  {
    name: "rejects a local candidate without city",
    candidate: {
      ...validCandidate,
      scope: "local",
      location: {
        countryCode: "DE",
        region: "Rheinland-Pfalz",
      },
    },
    expected: false,
  },
  {
    name: "rejects a national candidate with city",
    candidate: {
      ...validCandidate,
      location: {
        countryCode: "DE",
        city: "Mayen",
      },
    },
    expected: false,
  },
  {
    name: "rejects a procedure without steps",
    candidate: {
      ...validCandidate,
      procedure: { ...validCandidate.procedure, steps: [] },
    },
    expected: false,
  },
  {
    name: "rejects a document without title",
    candidate: {
      ...validCandidate,
      procedure: {
        ...validCandidate.procedure,
        steps: [
          {
            ...validCandidate.procedure.steps[0],
            documents: [
              {
                ...validCandidate.procedure.steps[0].documents[0],
                title: "",
              },
            ],
          },
        ],
      },
    },
    expected: false,
  },
  {
    name: "rejects an empty source list",
    candidate: {
      ...validCandidate,
      procedure: { ...validCandidate.procedure, sources: [] },
    },
    expected: false,
  },
  {
    name: "rejects an invalid source URL",
    candidate: {
      ...validCandidate,
      procedure: {
        ...validCandidate.procedure,
        sources: [
          {
            ...validCandidate.procedure.sources[0],
            url: "not-a-url",
          },
        ],
      },
    },
    expected: false,
  },
  {
    name: "requires duplicateOf for duplicate candidates",
    candidate: {
      ...validCandidate,
      status: "duplicate",
    },
    expected: false,
  },
  {
    name: "accepts duplicate candidates with duplicateOf",
    candidate: {
      ...validCandidate,
      status: "duplicate",
      duplicateOf: "wohnsitz-anmelden-de",
    },
    expected: true,
  },
];

let passed = 0;

for (const test of tests) {
  const result = validateDiscoveryCandidate(test.candidate);

  assert.equal(
    result.valid,
    test.expected,
    `Failed: ${test.name}. Errors: ${result.errors.join(", ")}`,
  );

  console.log(`✓ ${test.name}`);
  passed++;
}

console.log(`\n${passed}/${tests.length} tests passed.`);
