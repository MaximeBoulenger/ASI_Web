export interface IUes {
  ID: number | null;
  NumUes: string | null;
  AnneeFormation: number | null;
}

export class Parcours implements IParcours {
  constructor(
    public ID: number | null,
    public NomParcours: string | null,
    public AnneeFormation: number | null
  ) {}
}
