import { getProcedureById } from "../../../shared/procedures/index.js";

import type {
  ClarificationQuestion,
  ProcedureMatch,
  ProcedureMatchStatus,
} from "../types/assistant";

const allowedStatuses: ProcedureMatchStatus[] = [
  "matched",
  "discovered",
  "clarification_needed",
  "correction_needed",
  "not_supported",
  "out_of_scope",
];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isClarificationQuestion = (
  value: unknown,
): value is ClarificationQuestion => {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.question !== "string" ||
    !value.question.trim()
  ) {
    return false;
  }

  if (value.type === "text") {
    return true;
  }

  if (value.type === "single_choice") {
    return (
      Array.isArray(value.options) &&
      value.options.length > 0 &&
      value.options.every(
        (option) => typeof option === "string" && option.trim().length > 0,
      )
    );
  }

  return false;
};

export const validateAssistantResponse = (input: unknown): ProcedureMatch => {
  if (!isRecord(input)) {
    throw new Error("Assistant response must be an object");
  }

  if (
    typeof input.status !== "string" ||
    !allowedStatuses.includes(input.status as ProcedureMatchStatus)
  ) {
    throw new Error("Invalid assistant response status");
  }

  if (typeof input.language !== "string" || !input.language.trim()) {
    throw new Error("Assistant response language is required");
  }

  if (
    input.confidence !== undefined &&
    (typeof input.confidence !== "number" ||
      !Number.isFinite(input.confidence) ||
      input.confidence < 0 ||
      input.confidence > 1)
  ) {
    throw new Error("Confidence must be a number between 0 and 1");
  }

  if (input.message !== undefined && typeof input.message !== "string") {
    throw new Error("Message must be a string");
  }

  if (input.categoryId !== undefined && typeof input.categoryId !== "string") {
    throw new Error("Category ID must be a string");
  }

  if (input.status === "matched") {
    if (typeof input.procedureId !== "string" || !input.procedureId.trim()) {
      throw new Error("Procedure ID is required for matched status");
    }

    if (!getProcedureById(input.procedureId)) {
      throw new Error(`Unknown procedure ID: ${input.procedureId}`);
    }
  }

  if (input.status === "discovered") {
    if (!isRecord(input.discoveredProcedure)) {
      throw new Error("Discovered procedure is required for discovered status");
    }

    if (input.verificationStatus !== "unverified") {
      throw new Error("Discovered procedure must have unverified status");
    }

    if (input.procedureId !== undefined) {
      throw new Error("Procedure ID is not allowed for discovered status");
    }
  }

  if (input.status === "clarification_needed") {
    if (
      !Array.isArray(input.questions) ||
      input.questions.length === 0 ||
      !input.questions.every(isClarificationQuestion)
    ) {
      throw new Error("Valid clarification questions are required");
    }
  } else if (input.questions !== undefined) {
    throw new Error("Questions are only allowed for clarification status");
  }

  if (input.status === "out_of_scope") {
    if (typeof input.message !== "string" || !input.message.trim()) {
      throw new Error("Message is required for out_of_scope status");
    }

    if (input.procedureId !== undefined) {
      throw new Error("Procedure ID is not allowed for out_of_scope status");
    }
  }

  return input as unknown as ProcedureMatch;
};
