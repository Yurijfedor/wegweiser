import type { Procedure } from "../../../shared/procedures/types";

export type ProcedureMatchStatus =
  | "matched"
  | "discovered"
  | "clarification_needed"
  | "correction_needed"
  | "not_supported"
  | "out_of_scope";

export interface ProcedureMatch {
  status: ProcedureMatchStatus;
  language: string;

  procedureId?: string;
  categoryId?: string;
  confidence?: number;

  message?: string;
  questions?: ClarificationQuestion[];

  discoveredProcedure?: Procedure;
  verificationStatus?: "unverified";
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export type ClarificationQuestion =
  | {
      id: string;
      question: string;
      type: "text";
    }
  | {
      id: string;
      question: string;
      type: "single_choice";
      options: string[];
    };
