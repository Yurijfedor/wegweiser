export interface AvailableProcedure {
  id: string;
  title: string;
  description: string;
}

export const availableProcedures: AvailableProcedure[] = [
  {
    id: "kindergeld-beantragen",
    title: "Kindergeld beantragen",
    description: "Applying for Kindergeld",
  },
  {
    id: "wohnsitz-anmelden",
    title: "Wohnsitz anmelden",
    description: "Registering a residence",
  },
  {
    id: "aufenthaltstitel-beantragen",
    title: "Aufenthaltstitel beantragen",
    description: "Applying for or extending a residence permit",
  },
];
