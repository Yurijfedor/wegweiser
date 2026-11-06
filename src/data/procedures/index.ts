import { kindergeldBeantragen, kitaPlatzBeantragen } from "./familie";
import { wohnsitzAnmelden, wohnungKuendigen } from "./wohnen";
import { arbeitAufnehmen, arbeitslosMelden } from "./arbeit";
import {
  meldebescheinigungBeantragen,
  aufenthaltstitelBeantragen,
} from "./dokumente";
import { grundsicherungsgeldBeantragen, wohngeldBeantragen } from "./finanzen";

import type { Procedure } from "../../types/procedure";

export const procedures: Procedure[] = [
  wohnsitzAnmelden,
  wohnungKuendigen,
  kindergeldBeantragen,
  kitaPlatzBeantragen,
  arbeitAufnehmen,
  arbeitslosMelden,
  meldebescheinigungBeantragen,
  aufenthaltstitelBeantragen,
  grundsicherungsgeldBeantragen,
  wohngeldBeantragen,
];

export const getProcedureById = (id: string) =>
  procedures.find((procedure) => procedure.id === id);

export {
  wohnsitzAnmelden,
  wohnungKuendigen,
  kindergeldBeantragen,
  kitaPlatzBeantragen,
  arbeitAufnehmen,
  arbeitslosMelden,
  meldebescheinigungBeantragen,
  aufenthaltstitelBeantragen,
  grundsicherungsgeldBeantragen,
  wohngeldBeantragen,
};
