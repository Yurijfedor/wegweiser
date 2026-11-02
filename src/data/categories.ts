export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export const categories: Category[] = [
  {
    id: "wohnen",
    title: "Wohnen & Umzug",
    description: "Umzug, Anmeldung und alles rund ums Wohnen.",
    icon: "🏠",
    href: "#wohnen",
  },
  {
    id: "familie",
    title: "Familie & Kinder",
    description: "Informationen zu Familie, Kindern und Betreuung.",
    icon: "👨‍👩‍👧",
    href: "#familie",
  },
  {
    id: "arbeit",
    title: "Arbeit & Beruf",
    description: "Behördliche Schritte rund um Arbeit und Beruf.",
    icon: "💼",
    href: "#arbeit",
  },
  {
    id: "dokumente",
    title: "Dokumente & Ausweise",
    description: "Ausweise, Bescheinigungen und wichtige Unterlagen.",
    icon: "📄",
    href: "#dokumente",
  },
  {
    id: "finanzen",
    title: "Finanzen & Leistungen",
    description: "Anträge, finanzielle Unterstützung und Leistungen.",
    icon: "💶",
    href: "#finanzen",
  },
  {
    id: "alltag",
    title: "Alltag & Sonstiges",
    description: "Weitere wichtige Angelegenheiten des Alltags.",
    icon: "📋",
    href: "#alltag",
  },
];
