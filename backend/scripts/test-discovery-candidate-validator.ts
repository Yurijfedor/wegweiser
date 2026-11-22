import assert from "node:assert/strict";

import { validateDiscoveryCandidateBusinessRules } from "../src/services/discovery/discoveryCandidateValidator";

import type { DiscoveryCandidate } from "../src/services/discovery/discoveryCandidate";

import type { Procedure } from "../../shared/procedures/types.js";

const catalog: Procedure[] = [
  {
    id: "wohnsitz-anmelden-de",
    categoryId: "wohnen",
    title: "Wohnsitz anmelden",
    description: "National procedure.",
    region: "Deutschland",
    steps: [
      {
        id: "registration",
        title: "Registration",
        description: "Register your residence.",
        documents: [],
      },
    ],
    sources: [
      {
        title: "Official source",
        url: "https://www.example.de",
        authority: "Federal authority",
      },
    ],
  },
  {
    id: "wohnsitz-anmelden-rp",
    categoryId: "wohnen",
    title: "Wohnsitz anmelden in Rheinland-Pfalz",
    description: "State procedure.",
    region: "Rheinland-Pfalz",
    steps: [
      {
        id: "registration",
        title: "Registration",
        description: "Register your residence.",
        documents: [],
      },
    ],
    sources: [
      {
        title: "Official source",
        url: "https://www.example.de",
        authority: "State authority",
      },
    ],
  },
];

const createCandidate = (
  overrides: Partial<DiscoveryCandidate> = {},
): DiscoveryCandidate => ({
  id: "candidate-001",

  procedure: {
    categoryId: "wohnen",
    title: "Wohnsitz anmelden in Mayen",
    description: "Local registration procedure.",
    region: "Mayen, Rheinland-Pfalz",

    steps: [
      {
        id: "registration",
        title: "Registration",
        description: "Register your residence.",
        documents: [],
      },
    ],

    sources: [
      {
        title: "Official source",
        url: "https://www.example.de",
        authority: "City authority",
      },
    ],
  },

  scope: "local",

  location: {
    countryCode: "DE",
    region: "Rheinland-Pfalz",
    city: "Mayen",
  },

  baseProcedureId: "wohnsitz-anmelden-rp",

  originalQuery: "Wie melde ich meinen Wohnsitz in Mayen an?",
  discoveredBy: "ai",
  createdAt: "2026-11-22T10:00:00.000Z",
  status: "pending_review",

  ...overrides,
});

const tests = [
  {
    name: "accepts an existing base procedure",
    candidate: createCandidate(),
    expected: true,
  },
  {
    name: "rejects an unknown base procedure",
    candidate: createCandidate({
      baseProcedureId: "unknown-procedure",
    }),
    expected: false,
  },
  {
    name: "rejects self-reference as base procedure",
    candidate: createCandidate({
      id: "wohnsitz-anmelden-rp",
      baseProcedureId: "wohnsitz-anmelden-rp",
    }),
    expected: false,
  },
  {
    name: "rejects a base procedure for national candidates",
    candidate: createCandidate({
      scope: "national",
      location: {
        countryCode: "DE",
      },
      baseProcedureId: "wohnsitz-anmelden-de",
    }),
    expected: false,
  },
  {
    name: "accepts a state candidate with an existing base",
    candidate: createCandidate({
      scope: "state",
      location: {
        countryCode: "DE",
        region: "Rheinland-Pfalz",
      },
      baseProcedureId: "wohnsitz-anmelden-de",
    }),
    expected: true,
  },
  {
    name: "accepts a duplicate of an existing procedure",
    candidate: createCandidate({
      status: "duplicate",
      baseProcedureId: undefined,
      duplicateOf: "wohnsitz-anmelden-de",
    }),
    expected: true,
  },
  {
    name: "rejects an unknown duplicate procedure",
    candidate: createCandidate({
      status: "duplicate",
      baseProcedureId: undefined,
      duplicateOf: "unknown-procedure",
    }),
    expected: false,
  },
  {
    name: "rejects self-reference as duplicate",
    candidate: createCandidate({
      id: "wohnsitz-anmelden-de",
      baseProcedureId: undefined,
      duplicateOf: "wohnsitz-anmelden-de",
      status: "duplicate",
    }),
    expected: false,
  },
  {
    name: "rejects duplicateOf without duplicate status",
    candidate: createCandidate({
      duplicateOf: "wohnsitz-anmelden-de",
    }),
    expected: false,
  },
];

let passed = 0;

for (const test of tests) {
  const result = validateDiscoveryCandidateBusinessRules(
    test.candidate,
    catalog,
  );

  assert.equal(
    result.valid,
    test.expected,
    `Failed: ${test.name}. Errors: ${result.errors.join(", ")}`,
  );

  console.log(`✓ ${test.name}`);
  passed++;
}

console.log(`\n${passed}/${tests.length} tests passed.`);
