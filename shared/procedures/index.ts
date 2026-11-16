import type { Procedure } from "./types.js";

import { kindergeldBeantragen, kitaPlatzBeantragen } from "./familie.js";
import { wohnsitzAnmelden, wohnungKuendigen } from "./wohnen.js";
import { arbeitAufnehmen, arbeitslosMelden } from "./arbeit.js";
import {
  meldebescheinigungBeantragen,
  aufenthaltstitelBeantragen,
} from "./dokumente.js";
import {
  grundsicherungsgeldBeantragen,
  wohngeldBeantragen,
} from "./finanzen.js";
import { fuehrerscheinUmschreiben, hundAnmelden } from "./alltag.js";

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
  fuehrerscheinUmschreiben,
  hundAnmelden,
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
  fuehrerscheinUmschreiben,
  hundAnmelden,
};

export type {
  Procedure,
  ProcedureDocument,
  ProcedureStep,
  ProcedureSource,
  ProcedureAuthority,
} from "./types.js";

export { validateProcedures } from "./validate.js";
export type { ValidationError } from "./validate.js";
