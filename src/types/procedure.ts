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

export interface ProcedureSource {
  title: string;
  url: string;
  authority: string;
}

export interface ProcedureAuthority {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
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
  steps: ProcedureStep[];
}
