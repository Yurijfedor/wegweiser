import type { Procedure, ProcedureVerificationStatus } from "./types.js";

export interface VerificationResult {
  success: boolean;
  status: ProcedureVerificationStatus;
  reason?: string;
}

export const verifyProcedure = (
  procedure: Procedure,
  verifiedBy: string,
  verifiedAt: string = new Date().toISOString(),
): VerificationResult => {
  if (!verifiedBy.trim()) {
    return {
      success: false,
      status: procedure.verification?.status ?? "unverified",
      reason: "A reviewer is required.",
    };
  }

  if (Number.isNaN(Date.parse(verifiedAt))) {
    return {
      success: false,
      status: procedure.verification?.status ?? "unverified",
      reason: "A valid verification date is required.",
    };
  }

  if (!procedure.sources?.length) {
    return {
      success: false,
      status: "needs_review",
      reason: "At least one source is required.",
    };
  }

  const allSourcesVerified = procedure.sources.every(
    (source) => source.verification?.status === "verified",
  );

  if (!allSourcesVerified) {
    return {
      success: false,
      status: "needs_review",
      reason: "All sources must be verified first.",
    };
  }

  return {
    success: true,
    status: "verified",
  };
};

export const markProcedureForReview = (
  procedure: Procedure,
  reason: string,
): VerificationResult => {
  if (!reason.trim()) {
    return {
      success: false,
      status: procedure.verification?.status ?? "unverified",
      reason: "A review reason is required.",
    };
  }

  return {
    success: true,
    status: "needs_review",
    reason,
  };
};
