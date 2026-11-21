export interface ProcedureDocument {
  id: string;
  title: string;
  description: string;
  required: boolean;
  condition?: string;
}

export interface ProcedureStep {
  id: string;
  title: string;
  description: string;
  documents: ProcedureDocument[];
}

export type SourceVerificationStatus =
  | "unverified"
  | "verified"
  | "needs_review";

export interface ProcedureSource {
  title: string;
  url: string;
  authority: string;

  verification?: {
    status: SourceVerificationStatus;
    lastCheckedAt?: string;
    checkedBy?: string;
    note?: string;
  };
}

export type ProcedureVerificationStatus =
  | "unverified"
  | "verified"
  | "needs_review";

export interface ProcedureVerification {
  status: ProcedureVerificationStatus;
  lastVerifiedAt?: string;
  verifiedBy?: string;
  nextReviewAt?: string;
  reviewNote?: string;
}

export interface ProcedureAuthority {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface Procedure {
  id: string;
  categoryId: string;

  title: string;
  description: string;

  region: string;
  deadline?: string;

  authority?: ProcedureAuthority;
  sources?: ProcedureSource[];
  verification?: ProcedureVerification;
  steps: ProcedureStep[];
}
