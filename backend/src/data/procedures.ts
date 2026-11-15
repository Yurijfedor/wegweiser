export interface AvailableProcedure {
  id: string;
  title: string;
  description: string;
}

export const availableProcedures: AvailableProcedure[] = [
  {
    id: "hund-anmelden",
    title: "Hund anmelden",
    description: "Registering a dog",
  },
  {
    id: "fuehrerschein-umschreiben",
    title: "Führerschein umschreiben",
    description: "Exchanging or converting a driving licence",
  },
  {
    id: "arbeit-aufnehmen",
    title: "Arbeit aufnehmen",
    description: "Starting a new job or employment",
  },
  {
    id: "arbeitslos-melden",
    title: "Arbeitslos melden",
    description: "Registering as unemployed",
  },
  {
    id: "meldebescheinigung-beantragen",
    title: "Meldebescheinigung beantragen",
    description: "Applying for a registration certificate",
  },
  {
    id: "aufenthaltstitel-beantragen",
    title: "Aufenthaltstitel beantragen",
    description: "Applying for or extending a residence permit",
  },
  {
    id: "kindergeld-beantragen",
    title: "Kindergeld beantragen",
    description: "Applying for Kindergeld",
  },
  {
    id: "kita-platz-beantragen",
    title: "Kita-Platz beantragen",
    description: "Applying for a childcare place",
  },
  {
    id: "grundsicherungsgeld-beantragen",
    title: "Grundsicherungsgeld beantragen",
    description: "Applying for basic income support",
  },
  {
    id: "wohngeld-beantragen",
    title: "Wohngeld beantragen",
    description: "Applying for housing benefit",
  },
  {
    id: "wohnsitz-anmelden",
    title: "Wohnsitz anmelden",
    description: "Registering a residence",
  },
  {
    id: "wohnung-kuendigen",
    title: "Wohnung kündigen",
    description: "Terminating a rental agreement",
  },
];
