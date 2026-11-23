import type {
  DiscoveryCandidate,
  DiscoveryCandidateStatus,
} from "./discoveryCandidate";

import type { DiscoveryRepository } from "./discoveryRepository";

export const createInMemoryDiscoveryRepository = (): DiscoveryRepository => {
  const candidates = new Map<string, DiscoveryCandidate>();

  return {
    async add(candidate) {
      if (candidates.has(candidate.id)) {
        throw new Error(`Discovery candidate already exists: ${candidate.id}`);
      }

      candidates.set(candidate.id, structuredClone(candidate));
    },

    async getById(id) {
      const candidate = candidates.get(id);

      return candidate ? structuredClone(candidate) : null;
    },

    async getAll() {
      return Array.from(candidates.values()).map((candidate) =>
        structuredClone(candidate),
      );
    },

    async updateStatus(id, status: DiscoveryCandidateStatus) {
      const candidate = candidates.get(id);

      if (!candidate) {
        return null;
      }

      const updatedCandidate: DiscoveryCandidate = {
        ...candidate,
        status,
      };

      candidates.set(id, updatedCandidate);

      return structuredClone(updatedCandidate);
    },
  };
};
