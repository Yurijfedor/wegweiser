import { procedures } from "../../../../shared/procedures";
import type { Procedure } from "../../../../shared/procedures/types.js";

import { validateDiscoveryCandidate } from "./discoveryValidator";

import { procedureCategoryIds } from "../../../../shared/procedures/index.js";

import type { DiscoveryCandidate } from "./discoveryCandidate";

export interface DiscoveryCandidateValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateDiscoveryCandidateBusinessRules = (
  candidate: unknown,
  catalog: Procedure[] = procedures,
): DiscoveryCandidateValidationResult => {
  const structuralResult = validateDiscoveryCandidate(candidate);

  if (!structuralResult.valid) {
    return structuralResult;
  }

  const value = candidate as DiscoveryCandidate;
  const errors: string[] = [];

  if (!procedureCategoryIds.includes(value.procedure.categoryId)) {
    errors.push(`Unknown procedure category "${value.procedure.categoryId}".`);
  }

  const findProcedure = (id: string) =>
    catalog.find((procedure) => procedure.id === id);

  // Base procedure relationship

  if (value.baseProcedureId) {
    const baseProcedure = findProcedure(value.baseProcedureId);

    if (!baseProcedure) {
      errors.push(`Base procedure "${value.baseProcedureId}" does not exist.`);
    }

    if (value.baseProcedureId === value.id) {
      errors.push("Candidate cannot reference itself as base procedure.");
    }

    if (value.scope === "national") {
      errors.push("National candidates cannot have a base procedure.");
    }
  }

  // Duplicate relationship

  if (value.duplicateOf) {
    const duplicateProcedure = findProcedure(value.duplicateOf);

    if (!duplicateProcedure) {
      errors.push(`Duplicate procedure "${value.duplicateOf}" does not exist.`);
    }

    if (value.duplicateOf === value.id) {
      errors.push("Candidate cannot be a duplicate of itself.");
    }

    if (value.status !== "duplicate") {
      errors.push("duplicateOf can only be used with duplicate status.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
