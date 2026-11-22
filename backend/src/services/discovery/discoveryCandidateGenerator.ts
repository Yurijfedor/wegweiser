import type { DiscoveryCandidate } from "./discoveryCandidate";
import type {
  DiscoverySourceQuery,
  DiscoverySourceResult,
} from "./discoverySourceProvider";

export interface DiscoveryCandidateGenerationInput {
  query: DiscoverySourceQuery;
  sources: DiscoverySourceResult[];
}

export interface DiscoveryCandidateGenerator {
  generate(
    input: DiscoveryCandidateGenerationInput,
  ): Promise<
    Omit<DiscoveryCandidate, "id" | "createdAt" | "status" | "discoveredBy">
  >;
}
