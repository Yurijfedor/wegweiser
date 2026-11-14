export type ProcedureMatchStatus =
  | "matched"
  | "clarification_needed"
  | "correction_needed"
  | "not_supported";

export interface ProcedureMatch {
  status: ProcedureMatchStatus;
  language: string;

  procedureId?: string;
  categoryId?: string;
  confidence?: number;

  message?: string;
  questions?: ClarificationQuestion[];
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
