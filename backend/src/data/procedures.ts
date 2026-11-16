import { procedures } from "../../../shared/procedures";

export interface AvailableProcedure {
  id: string;
  title: string;
  description: string;
}

export const availableProcedures: AvailableProcedure[] = procedures.map(
  ({ id, title, description }) => ({
    id,
    title,
    description,
  }),
);
