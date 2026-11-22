export interface ProcedureCategory {
  id: string;
  title: string;
  description: string;
}

export const procedureCategories: ProcedureCategory[] = [
  {
    id: "wohnen",
    title: "Wohnen & Umzug",
    description: "Umzug, Anmeldung und alles rund ums Wohnen.",
  },
  {
    id: "familie",
    title: "Familie & Kinder",
    description: "Informationen zu Familie, Kindern und Betreuung.",
  },
  {
    id: "arbeit",
    title: "Arbeit & Beruf",
    description: "Behördliche Schritte rund um Arbeit und Beruf.",
  },
  {
    id: "dokumente",
    title: "Dokumente & Ausweise",
    description: "Ausweise, Bescheinigungen und wichtige Unterlagen.",
  },
  {
    id: "finanzen",
    title: "Finanzen & Leistungen",
    description: "Anträge, finanzielle Unterstützung und Leistungen.",
  },
  {
    id: "alltag",
    title: "Alltag & Sonstiges",
    description: "Weitere wichtige Angelegenheiten des Alltags.",
  },
];

export const procedureCategoryIds = procedureCategories.map(
  (category) => category.id,
);
