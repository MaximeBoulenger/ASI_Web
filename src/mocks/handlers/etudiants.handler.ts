import { http, HttpResponse } from 'msw';
import type { Etudiant } from '@/domain/entities/Etudiant';

const initialEtudiants: Etudiant[] = [
  { ID: 1, Nom: 'Dupont', Prenom: 'Marie', Parcours: 1 },
  { ID: 2, Nom: 'Martin', Prenom: 'Lucas', Parcours: 2 }
];

let etudiantsStore = [...initialEtudiants];

const getNextId = () =>
  etudiantsStore.length ? Math.max(...etudiantsStore.map((e) => e.ID ?? 0)) + 1 : 1;

const serializeEtudiant = (etudiant: Etudiant) => ({
  ...etudiant,
  Parcours:
    typeof etudiant.Parcours === 'object'
      ? etudiant.Parcours?.ID ?? etudiant.Parcours
      : etudiant.Parcours
});

export const etudiantsHandlers = [
  http.get('/api/Etudiants', () => {
    return HttpResponse.json(etudiantsStore.map(serializeEtudiant));
  }),

  http.get('/api/Etudiants/:id', ({ params }) => {
    const id = Number(params.id);
    const etudiant = etudiantsStore.find((e) => e.ID === id);

    if (!etudiant) {
      return HttpResponse.json({ message: 'Etudiant not found' }, { status: 404 });
    }

    return HttpResponse.json(serializeEtudiant(etudiant));
  }),

  http.post('/api/Etudiants', async ({ request }) => {
    const body = (await request.json()) as Etudiant;
    const newEtudiant: Etudiant = {
      ...body,
      ID: getNextId()
    };

    etudiantsStore = [newEtudiant, ...etudiantsStore];
    return HttpResponse.json(serializeEtudiant(newEtudiant), { status: 201 });
  }),

  http.put('/api/Etudiants/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const updates = (await request.json()) as Etudiant;
    const index = etudiantsStore.findIndex((e) => e.ID === id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Etudiant not found' }, { status: 404 });
    }

    const updated: Etudiant = { ...etudiantsStore[index], ...updates, ID: id };
    etudiantsStore[index] = updated;

    return HttpResponse.json(serializeEtudiant(updated));
  }),

  http.delete('/api/Etudiants/:id', ({ params }) => {
    const id = Number(params.id);
    const exists = etudiantsStore.some((e) => e.ID === id);

    if (!exists) {
      return HttpResponse.json({ message: 'Etudiant not found' }, { status: 404 });
    }

    etudiantsStore = etudiantsStore.filter((e) => e.ID !== id);
    return new HttpResponse(null, { status: 204 });
  })
];
