import type { DiscoveryCandidate, ProcedureScope } from "./discoveryCandidate";

export interface DiscoveryValidationResult {
  valid: boolean;
  errors: string[];
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidDate = (value: unknown): boolean =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const isValidScope = (value: unknown): value is ProcedureScope =>
  value === "national" || value === "state" || value === "local";

export const validateDiscoveryCandidate = (
  candidate: unknown,
): DiscoveryValidationResult => {
  const errors: string[] = [];

  if (!candidate || typeof candidate !== "object") {
    return {
      valid: false,
      errors: ["Candidate must be an object."],
    };
  }

  const value = candidate as Partial<DiscoveryCandidate>;

  // Discovery metadata

  if (!isNonEmptyString(value.id)) {
    errors.push("Candidate ID is required.");
  }

  if (!isNonEmptyString(value.originalQuery)) {
    errors.push("Original query is required.");
  }

  if (value.discoveredBy !== "ai") {
    errors.push('discoveredBy must be "ai".');
  }

  const allowedStatuses = [
    "pending_review",
    "approved",
    "rejected",
    "duplicate",
  ];

  if (!allowedStatuses.includes(value.status ?? "")) {
    errors.push("Invalid candidate status.");
  }

  if (value.status === "duplicate" && !isNonEmptyString(value.duplicateOf)) {
    errors.push("duplicateOf is required for duplicate candidates.");
  }

  if (value.duplicateOf !== undefined && !isNonEmptyString(value.duplicateOf)) {
    errors.push("duplicateOf must be a non-empty string.");
  }

  if (!isValidDate(value.createdAt)) {
    errors.push("Valid creation date is required.");
  }

  // Geographic scope

  if (!isValidScope(value.scope)) {
    errors.push("Invalid procedure scope.");
  }

  if (!value.location || !isNonEmptyString(value.location.countryCode)) {
    errors.push("Location must include countryCode.");
  } else {
    if (
      value.location.region !== undefined &&
      !isNonEmptyString(value.location.region)
    ) {
      errors.push("Location region must be a non-empty string.");
    }

    if (
      value.location.city !== undefined &&
      !isNonEmptyString(value.location.city)
    ) {
      errors.push("Location city must be a non-empty string.");
    }

    if (value.scope === "state" && !isNonEmptyString(value.location.region)) {
      errors.push("State-level candidates require a region.");
    }

    if (
      value.scope === "local" &&
      (!isNonEmptyString(value.location.region) ||
        !isNonEmptyString(value.location.city))
    ) {
      errors.push("Local candidates require a region and city.");
    }

    if (
      value.scope === "national" &&
      (value.location.region !== undefined || value.location.city !== undefined)
    ) {
      errors.push("National candidates must not specify a region or city.");
    }
  }

  if (
    value.baseProcedureId !== undefined &&
    !isNonEmptyString(value.baseProcedureId)
  ) {
    errors.push("baseProcedureId must be a non-empty string.");
  }

  // Procedure content

  const procedure = value.procedure;

  if (!procedure || typeof procedure !== "object") {
    errors.push("Procedure content is required.");
  } else {
    if (!isNonEmptyString(procedure.categoryId)) {
      errors.push("Procedure categoryId is required.");
    }

    if (!isNonEmptyString(procedure.title)) {
      errors.push("Procedure title is required.");
    }

    if (!isNonEmptyString(procedure.description)) {
      errors.push("Procedure description is required.");
    }

    if (!isNonEmptyString(procedure.region)) {
      errors.push("Procedure region is required.");
    }

    if (
      procedure.deadline !== undefined &&
      !isNonEmptyString(procedure.deadline)
    ) {
      errors.push("Procedure deadline must be a non-empty string.");
    }

    // Steps and documents

    if (!Array.isArray(procedure.steps) || procedure.steps.length === 0) {
      errors.push("Procedure must contain at least one step.");
    } else {
      procedure.steps.forEach((step, index) => {
        const prefix = `Step ${index + 1}`;

        if (!isNonEmptyString(step.id)) {
          errors.push(`${prefix}: ID is required.`);
        }

        if (!isNonEmptyString(step.title)) {
          errors.push(`${prefix}: title is required.`);
        }

        if (!isNonEmptyString(step.description)) {
          errors.push(`${prefix}: description is required.`);
        }

        if (!Array.isArray(step.documents)) {
          errors.push(`${prefix}: documents must be an array.`);
        } else {
          step.documents.forEach((document, documentIndex) => {
            const documentPrefix = `${prefix}, document ${documentIndex + 1}`;

            if (!isNonEmptyString(document.id)) {
              errors.push(`${documentPrefix}: ID is required.`);
            }

            if (!isNonEmptyString(document.title)) {
              errors.push(`${documentPrefix}: title is required.`);
            }

            if (!isNonEmptyString(document.description)) {
              errors.push(`${documentPrefix}: description is required.`);
            }

            if (typeof document.required !== "boolean") {
              errors.push(`${documentPrefix}: required must be a boolean.`);
            }

            if (
              document.condition !== undefined &&
              !isNonEmptyString(document.condition)
            ) {
              errors.push(
                `${documentPrefix}: condition must be a non-empty string.`,
              );
            }
          });
        }
      });
    }

    // Authority

    if (procedure.authority !== undefined) {
      if (!procedure.authority || !isNonEmptyString(procedure.authority.name)) {
        errors.push("Procedure authority must include a name.");
      }
    }

    // Sources

    if (!Array.isArray(procedure.sources) || procedure.sources.length === 0) {
      errors.push("Procedure must contain at least one source.");
    } else {
      procedure.sources.forEach((source, index) => {
        const prefix = `Source ${index + 1}`;

        if (!isNonEmptyString(source.title)) {
          errors.push(`${prefix}: title is required.`);
        }

        if (!isNonEmptyString(source.authority)) {
          errors.push(`${prefix}: authority is required.`);
        }

        if (!isNonEmptyString(source.url) || !isValidUrl(source.url)) {
          errors.push(`${prefix}: valid URL is required.`);
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
