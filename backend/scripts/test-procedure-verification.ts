import { wohnsitzAnmelden } from "../../shared/procedures/index.js";
import {
  verifyProcedure,
  markProcedureForReview,
} from "../../shared/procedures/verification.js";

import type { Procedure } from "../../shared/procedures/index.js";

const verifiedProcedure: Procedure = {
  ...wohnsitzAnmelden,
  verification: {
    status: "unverified",
  },
  sources: wohnsitzAnmelden.sources?.map((source) => ({
    ...source,
    verification: {
      status: "verified",
      lastCheckedAt: "2026-11-21T10:00:00.000Z",
      checkedBy: "admin",
    },
  })),
};

const tests = [
  {
    name: "Reject empty reviewer",
    result: verifyProcedure(verifiedProcedure, " "),
    expectedSuccess: false,
  },
  {
    name: "Reject invalid date",
    result: verifyProcedure(verifiedProcedure, "admin", "invalid-date"),
    expectedSuccess: false,
  },
  {
    name: "Allow verification when all sources are verified",
    result: verifyProcedure(
      verifiedProcedure,
      "admin",
      "2026-11-21T12:00:00.000Z",
    ),
    expectedSuccess: true,
  },
  {
    name: "Reject procedure without sources",
    result: verifyProcedure({ ...verifiedProcedure, sources: [] }, "admin"),
    expectedSuccess: false,
  },
  {
    name: "Reject procedure with unverified source",
    result: verifyProcedure(
      {
        ...verifiedProcedure,
        sources: verifiedProcedure.sources?.map((source, index) =>
          index === 0
            ? {
                ...source,
                verification: { status: "unverified" },
              }
            : source,
        ),
      },
      "admin",
    ),
    expectedSuccess: false,
  },
  {
    name: "Allow marking procedure for review",
    result: markProcedureForReview(
      verifiedProcedure,
      "Source information may be outdated.",
    ),
    expectedSuccess: true,
  },
  {
    name: "Reject empty review reason",
    result: markProcedureForReview(verifiedProcedure, " "),
    expectedSuccess: false,
  },
];

console.log("Testing procedure verification service...\n");

for (const test of tests) {
  const passed = test.result.success === test.expectedSuccess;

  console.log(`${passed ? "PASS" : "FAIL"}: ${test.name}`);

  if (!passed) {
    throw new Error(`Test failed: ${test.name}`);
  }
}

console.log("\nSuccess! All verification tests passed.");
