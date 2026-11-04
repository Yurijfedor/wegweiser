import { wohnsitzAnmelden } from "./wohnen";

import type { Procedure } from "../../types/procedure";

export const procedures: Procedure[] = [wohnsitzAnmelden];

export const getProcedureById = (id: string) =>
  procedures.find((procedure) => procedure.id === id);

export { wohnsitzAnmelden };
