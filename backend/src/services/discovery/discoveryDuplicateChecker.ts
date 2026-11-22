import { procedures } from "../../../../shared/procedures";

import type { DiscoveryCandidate } from "./discoveryCandidate";
import type { DiscoveryRepository } from "./discoveryRepository";

export type DiscoveryDuplicateResult =
  | {
      isDuplicate: false;
    }
  | {
      isDuplicate: true;
      duplicateOf: string;
      reason: "catalog" | "candidate";
    };

const normalizeText = (value: string): string =>
  value
    .toLocaleLowerCase("de")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokenize = (value: string): Set<string> =>
  new Set(normalizeText(value).split(/\s+/).filter(Boolean));

const calculateSimilarity = (first: string, second: string): number => {
  const firstTokens = tokenize(first);
  const secondTokens = tokenize(second);

  if (firstTokens.size === 0 || secondTokens.size === 0) {
    return 0;
  }

  const intersection = [...firstTokens].filter((token) =>
    secondTokens.has(token),
  ).length;

  const union = new Set([...firstTokens, ...secondTokens]).size;

  return intersection / union;
};

const isSimilar = (first: string, second: string): boolean =>
  normalizeText(first) === normalizeText(second) ||
  calculateSimilarity(first, second) >= 0.8;

export const createDiscoveryDuplicateChecker = (
  repository: DiscoveryRepository,
) => {
  return {
    async check(
      candidate: DiscoveryCandidate,
    ): Promise<DiscoveryDuplicateResult> {
      // Check the existing procedure catalog first.
      const catalogMatch = procedures.find(
        (procedure) =>
          procedure.categoryId === candidate.procedure.categoryId &&
          (isSimilar(procedure.title, candidate.procedure.title) ||
            isSimilar(procedure.description, candidate.procedure.description)),
      );

      if (catalogMatch) {
        return {
          isDuplicate: true,
          duplicateOf: catalogMatch.id,
          reason: "catalog",
        };
      }

      // Check existing discovery candidates.
      const existingCandidates = await repository.getAll();

      const candidateMatch = existingCandidates.find((existing) => {
        if (
          existing.id === candidate.id ||
          existing.procedure.categoryId !== candidate.procedure.categoryId ||
          !["pending_review", "approved"].includes(existing.status)
        ) {
          return false;
        }

        return (
          isSimilar(existing.procedure.title, candidate.procedure.title) ||
          isSimilar(
            existing.procedure.description,
            candidate.procedure.description,
          )
        );
      });

      if (candidateMatch) {
        return {
          isDuplicate: true,
          duplicateOf: candidateMatch.id,
          reason: "candidate",
        };
      }

      return {
        isDuplicate: false,
      };
    },
  };
};
