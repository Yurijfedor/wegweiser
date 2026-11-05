import { kindergeldBeantragen, kitaPlatzBeantragen } from "./familie";
import { wohnsitzAnmelden, wohnungKuendigen } from "./wohnen";

import type { Procedure } from "../../types/procedure";

export const procedures: Procedure[] = [
  wohnsitzAnmelden,
  wohnungKuendigen,
  kindergeldBeantragen,
  kitaPlatzBeantragen,
];

export const getProcedureById = (id: string) =>
  procedures.find((procedure) => procedure.id === id);

export {
  wohnsitzAnmelden,
  wohnungKuendigen,
  kindergeldBeantragen,
  kitaPlatzBeantragen,
};
