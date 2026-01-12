import { Parcours } from './Parcours';

export interface IEtudiant {
  ID: number | null;
  Nom: string | null;
  Prenom: string | null;
  Email: string | null;
  Parcours: Parcours | number | null;
  toJSON(): Object;
}

export class Etudiant implements IEtudiant {
  constructor(
    public ID: number | null,
    public Nom: string | null,
    public Prenom: string | null,
    public Email: string | null,
    public Parcours: Parcours | number | null
  ) {}

  toJSON(): Object {
    return {
      ID: this.ID,
      Nom: this.Nom,
      Prenom: this.Prenom,
      Email: this.Email,
      Parcours:
        typeof this.Parcours === 'object'
          ? this.Parcours?.ID ?? this.Parcours
          : this.Parcours
    };
  }
}
