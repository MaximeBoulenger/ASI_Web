import { http, HttpResponse } from 'msw';
import type { UE } from '@/domain/entities/UE';

const initialUEs: UE[] = [
  { ID: 1, NumeroUe: 'UE101', Intitule: 'Introduction a la programmation', Parcours: null },
  { ID: 2, NumeroUe: 'UE202', Intitule: 'Base de donnees', Parcours: null}
];

let uesStore = [...initialUEs];

const getNextId = () => (uesStore.length ? Math.max(...uesStore.map((u) => u.ID ?? 0)) + 1 : 1);

// Mirror UE.toJSON: return only the IDs of related parcours to match backend contract
const serializeUE = (ue: UE) => ({
  ...ue,
  Parcours: Array.isArray(ue.Parcours)
    ? ue.Parcours.map((p: any) => (typeof p === 'number' ? p : p?.ID ?? p))
    : ue.Parcours
});

export const uesHandlers = [
  http.get('/api/UEs', () => {
    return HttpResponse.json(uesStore.map(serializeUE));
  }),

  http.get('/api/UEs/:id', ({ params }) => {
    const id = Number(params.id);
    const ue = uesStore.find((u) => u.ID === id);

    if (!ue) {
      return HttpResponse.json({ message: 'UE not found' }, { status: 404 });
    }

    return HttpResponse.json(serializeUE(ue));
  }),

  http.post('/api/UEs', async ({ request }) => {
    const body = (await request.json()) as UE;
    const newUE: UE = {
      ...body,
      ID: getNextId()
    };

    uesStore = [newUE, ...uesStore];
    return HttpResponse.json(serializeUE(newUE), { status: 201 });
  }),

  http.put('/api/UEs/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const updates = (await request.json()) as UE;
    const index = uesStore.findIndex((u) => u.ID === id);

    if (index === -1) {
      return HttpResponse.json({ message: 'UE not found' }, { status: 404 });
    }

    const updated: UE = { ...uesStore[index], ...updates, ID: id };
    uesStore[index] = updated;

    return HttpResponse.json(serializeUE(updated));
  }),

  http.delete('/api/UEs/:id', ({ params }) => {
    const id = Number(params.id);
    const exists = uesStore.some((u) => u.ID === id);

    if (!exists) {
      return HttpResponse.json({ message: 'UE not found' }, { status: 404 });
    }

    uesStore = uesStore.filter((u) => u.ID !== id);
    return new HttpResponse(null, { status: 204 });
  })
];
