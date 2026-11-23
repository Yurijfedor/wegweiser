import type {
  DiscoveryCandidate,
  DiscoveryCandidateStatus,
} from "./discoveryCandidate";

export interface DiscoveryRepository {
  add(candidate: DiscoveryCandidate): Promise<void>;

  getById(id: string): Promise<DiscoveryCandidate | null>;

  getAll(): Promise<DiscoveryCandidate[]>;

  updateStatus(
    id: string,
    status: DiscoveryCandidateStatus,
  ): Promise<DiscoveryCandidate | null>;
}
