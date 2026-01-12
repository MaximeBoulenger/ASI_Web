import { Parcours } from './Parcours';

export interface IUE {
  ID: number | null;
  Intitule: string | null;
  NumeroUe: string | null;
  Parcours: Parcours[] | null;
  Notes?: Record<number, string> | null;
  toJSON(): Object;
}

export class UE implements IUE {
  constructor(
    public ID: number | null,
    public Intitule: string | null,
    public NumeroUe: string | null,
    public Parcours: Parcours[] | null,
    public Notes: Record<number, string> | null = null
  ) {}

  toJSON(): Object {
    return {
      ID: this.ID,
      Intitule: this.Intitule,
      NumeroUe: this.NumeroUe,
      Parcours: this.Parcours?.map((parcours) => parcours.ID),
      Notes: this.Notes
    };
  }
}
