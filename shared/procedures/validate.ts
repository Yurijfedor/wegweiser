import type { Procedure } from "./types.js";

export interface ValidationError {
  procedureId: string;
  path: string;
  message: string;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const isValidDate = (value: unknown): boolean => {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
};

const procedureVerificationStatuses = [
  "unverified",
  "verified",
  "needs_review",
] as const;

const sourceVerificationStatuses = [
  "unverified",
  "verified",
  "needs_review",
] as const;

export const validateProcedures = (
  procedures: Procedure[],
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const procedureIds = new Set<string>();

  const addError = (procedureId: string, path: string, message: string) => {
    errors.push({ procedureId, path, message });
  };

  procedures.forEach((procedure, procedureIndex) => {
    const id = isNonEmptyString(procedure.id)
      ? procedure.id
      : `index-${procedureIndex}`;

    const prefix = `procedures[${procedureIndex}]`;

    if (!isNonEmptyString(procedure.id)) {
      addError(id, `${prefix}.id`, "Procedure ID is required.");
    } else if (procedureIds.has(procedure.id)) {
      addError(id, `${prefix}.id`, "Duplicate procedure ID.");
    } else {
      procedureIds.add(procedure.id);
    }

    if (!isNonEmptyString(procedure.categoryId)) {
      addError(id, `${prefix}.categoryId`, "Category ID is required.");
    }

    if (!isNonEmptyString(procedure.title)) {
      addError(id, `${prefix}.title`, "Title is required.");
    }

    if (!isNonEmptyString(procedure.description)) {
      addError(id, `${prefix}.description`, "Description is required.");
    }

    if (!isNonEmptyString(procedure.region)) {
      addError(id, `${prefix}.region`, "Region is required.");
    }

    if (procedure.verification !== undefined) {
      const verification = procedure.verification;
      const verificationPath = `${prefix}.verification`;

      if (!procedureVerificationStatuses.includes(verification.status)) {
        addError(
          id,
          `${verificationPath}.status`,
          "Invalid procedure verification status.",
        );
      }

      if (
        verification.lastVerifiedAt !== undefined &&
        !isValidDate(verification.lastVerifiedAt)
      ) {
        addError(
          id,
          `${verificationPath}.lastVerifiedAt`,
          "A valid verification date is required.",
        );
      }

      if (
        verification.nextReviewAt !== undefined &&
        !isValidDate(verification.nextReviewAt)
      ) {
        addError(
          id,
          `${verificationPath}.nextReviewAt`,
          "A valid next review date is required.",
        );
      }

      if (
        verification.verifiedBy !== undefined &&
        !isNonEmptyString(verification.verifiedBy)
      ) {
        addError(
          id,
          `${verificationPath}.verifiedBy`,
          "Verified by must not be empty.",
        );
      }

      if (
        verification.reviewNote !== undefined &&
        typeof verification.reviewNote !== "string"
      ) {
        addError(
          id,
          `${verificationPath}.reviewNote`,
          "Review note must be a string.",
        );
      }
    }

    if (!Array.isArray(procedure.steps) || procedure.steps.length === 0) {
      addError(id, `${prefix}.steps`, "At least one step is required.");
      return;
    }

    const stepIds = new Set<string>();

    procedure.steps.forEach((step, stepIndex) => {
      const stepPath = `${prefix}.steps[${stepIndex}]`;

      if (!isNonEmptyString(step.id)) {
        addError(id, `${stepPath}.id`, "Step ID is required.");
      } else if (stepIds.has(step.id)) {
        addError(id, `${stepPath}.id`, "Duplicate step ID.");
      } else {
        stepIds.add(step.id);
      }

      if (!isNonEmptyString(step.title)) {
        addError(id, `${stepPath}.title`, "Step title is required.");
      }

      if (!isNonEmptyString(step.description)) {
        addError(
          id,
          `${stepPath}.description`,
          "Step description is required.",
        );
      }

      if (!Array.isArray(step.documents)) {
        addError(id, `${stepPath}.documents`, "Documents must be an array.");
        return;
      }

      const documentIds = new Set<string>();

      step.documents.forEach((document, documentIndex) => {
        const documentPath = `${stepPath}.documents[${documentIndex}]`;

        if (!isNonEmptyString(document.id)) {
          addError(id, `${documentPath}.id`, "Document ID is required.");
        } else if (documentIds.has(document.id)) {
          addError(id, `${documentPath}.id`, "Duplicate document ID in step.");
        } else {
          documentIds.add(document.id);
        }

        if (!isNonEmptyString(document.title)) {
          addError(id, `${documentPath}.title`, "Document title is required.");
        }

        if (!isNonEmptyString(document.description)) {
          addError(
            id,
            `${documentPath}.description`,
            "Document description is required.",
          );
        }

        if (typeof document.required !== "boolean") {
          addError(
            id,
            `${documentPath}.required`,
            "Required must be true or false.",
          );
        }
      });
    });

    procedure.sources?.forEach((source, sourceIndex) => {
      const sourcePath = `${prefix}.sources[${sourceIndex}]`;

      if (!isNonEmptyString(source.title)) {
        addError(id, `${sourcePath}.title`, "Source title is required.");
      }

      if (!isNonEmptyString(source.authority)) {
        addError(
          id,
          `${sourcePath}.authority`,
          "Source authority is required.",
        );
      }

      if (!isNonEmptyString(source.url) || !isValidUrl(source.url)) {
        addError(
          id,
          `${sourcePath}.url`,
          "A valid HTTP or HTTPS URL is required.",
        );
      }

      if (source.verification !== undefined) {
        const verification = source.verification;
        const verificationPath = `${sourcePath}.verification`;

        if (!sourceVerificationStatuses.includes(verification.status)) {
          addError(
            id,
            `${verificationPath}.status`,
            "Invalid source verification status.",
          );
        }

        if (
          verification.lastCheckedAt !== undefined &&
          !isValidDate(verification.lastCheckedAt)
        ) {
          addError(
            id,
            `${verificationPath}.lastCheckedAt`,
            "A valid source check date is required.",
          );
        }

        if (
          verification.checkedBy !== undefined &&
          !isNonEmptyString(verification.checkedBy)
        ) {
          addError(
            id,
            `${verificationPath}.checkedBy`,
            "Checked by must not be empty.",
          );
        }

        if (
          verification.note !== undefined &&
          typeof verification.note !== "string"
        ) {
          addError(
            id,
            `${verificationPath}.note`,
            "Source verification note must be a string.",
          );
        }
      }
    });

    if (
      procedure.authority?.website &&
      !isValidUrl(procedure.authority.website)
    ) {
      addError(
        id,
        `${prefix}.authority.website`,
        "A valid HTTP or HTTPS URL is required.",
      );
    }
  });

  return errors;
};
