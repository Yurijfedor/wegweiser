import type { Procedure } from "./procedure";

export interface LocationContext {
  countryCode: string;
  city: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantRequest {
  message: string;
  location: LocationContext;
  language: string;
  conversation?: ConversationMessage[];
}

export type QuestionType = "single_choice" | "text";

export interface TextQuestion {
  id: string;
  question: string;
  type: "text";
}

export interface SingleChoiceQuestion {
  id: string;
  question: string;
  type: "single_choice";
  options: string[];
}

export type ClarificationQuestion = TextQuestion | SingleChoiceQuestion;

export type ProcedureMatchStatus =
  | "matched"
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
}

export interface ProcedureSearchResult {
  status:
    | "procedure_found"
    | "clarification_needed"
    | "correction_needed"
    | "not_supported";

  language: string;

  procedure?: Procedure;

  message?: string;
  questions?: ClarificationQuestion[];
}
