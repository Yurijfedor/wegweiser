import {
  procedures,
  validateProcedures,
} from "../../shared/procedures/index.js";

console.log("Validating Wegweiser procedures...\n");

const errors = validateProcedures(procedures);

if (errors.length > 0) {
  console.error(`Found ${errors.length} validation error(s):\n`);

  for (const error of errors) {
    console.error(`[${error.procedureId}] ${error.path}: ${error.message}`);
  }

  throw new Error("Procedure validation failed.");
} else {
  console.log(`Success! All ${procedures.length} procedures are valid.`);
}
