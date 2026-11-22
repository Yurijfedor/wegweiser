import type { Procedure } from "../../../../shared/procedures/types.js";

export type DiscoveryCandidateStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "duplicate";

export type ProcedureScope = "national" | "state" | "local";

export interface DiscoveryLocation {
  countryCode: string;
  region?: string;
  city?: string;
}

export interface DiscoveryCandidate {
  id: string;

  // Proposed procedure content
  procedure: Omit<Procedure, "id">;

  // Geographic scope
  scope: ProcedureScope;
  location: DiscoveryLocation;

  // Relationship with existing procedures
  baseProcedureId?: string;

  // Discovery metadata
  originalQuery: string;
  discoveredBy: "ai";
  createdAt: string;
  status: DiscoveryCandidateStatus;

  // Duplicate detection
  duplicateOf?: string;
}
