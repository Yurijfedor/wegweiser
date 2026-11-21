import {
  procedures,
  validateProcedures,
} from "../../shared/procedures/index.js";

import type { Procedure } from "../../shared/procedures/index.js";

// Тест 1. Дубльований ID та порожня назва.
const invalidProcedure = {
  ...procedures[0],
  title: "",
};

// Тест 2. Некоректні метадані верифікації.
const invalidVerificationProcedure = {
  ...procedures[0],
  id: "invalid-verification-test",
  verification: {
    status: "invalid",
    lastVerifiedAt: "not-a-date",
    verifiedBy: " ",
  },
  sources: procedures[0].sources?.map((source, index) =>
    index === 0
      ? {
          ...source,
          verification: {
            status: "invalid",
            lastCheckedAt: "not-a-date",
            checkedBy: " ",
          },
        }
      : source,
  ),
} as unknown as Procedure;

// Запускаємо валідацію.
const errors = validateProcedures([
  ...procedures,
  invalidProcedure,
  invalidVerificationProcedure,
]);

const expectedErrors = [
  "Duplicate procedure ID.",
  "Title is required.",
  "Invalid procedure verification status.",
  "A valid verification date is required.",
  "Verified by must not be empty.",
  "Invalid source verification status.",
  "A valid source check date is required.",
  "Checked by must not be empty.",
];

console.log("Testing procedure validator...\n");
console.log("Detected errors:");

for (const error of errors) {
  console.log(`[${error.procedureId}] ${error.path}: ${error.message}`);
}

const missingErrors = expectedErrors.filter(
  (message) => !errors.some((error) => error.message === message),
);

if (missingErrors.length > 0) {
  throw new Error(
    `Validator did not detect expected errors: ${missingErrors.join(", ")}`,
  );
}

console.log("\nSuccess! All expected validation errors were detected.");
