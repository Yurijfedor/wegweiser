import {
  procedures,
  validateProcedures,
} from "../../shared/procedures/index.js";

// Створюємо копію першої процедури з навмисною помилкою.
const invalidProcedure = {
  ...procedures[0],
  title: "",
};

// Додаємо її до каталогу.
// ID буде дублюватися, а title буде порожнім.
const errors = validateProcedures([...procedures, invalidProcedure]);

const hasDuplicateIdError = errors.some(
  (error) => error.message === "Duplicate procedure ID.",
);

const hasMissingTitleError = errors.some(
  (error) => error.message === "Title is required.",
);

console.log("Testing procedure validator...\n");
console.log("Detected errors:");

for (const error of errors) {
  console.log(`[${error.procedureId}] ${error.path}: ${error.message}`);
}

if (!hasDuplicateIdError || !hasMissingTitleError) {
  throw new Error("Validator did not detect all expected errors.");
}

console.log("\nSuccess! Validator detected both expected errors.");
