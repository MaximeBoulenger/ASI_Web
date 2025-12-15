import { http, HttpResponse } from 'msw';
import type { Parcours } from '@/domain/entities/Parcours';

const initialParcours: Parcours[] = [
    { ID: 1, NomParcours: 'Finance', AnneeFormation: 2024 },
    { ID: 2, NomParcours: 'Informatique', AnneeFormation: 2025 },
];

let parcoursStore = [...initialParcours];

const getNextId = () => (parcoursStore.length ? Math.max(...parcoursStore.map((p) => p.ID ?? 0)) + 1 : 1);

export const parcoursHandlers = [
    http.get('/api/Parcours', () => {
        return HttpResponse.json(parcoursStore);
    }),
    
    http.get('/api/Parcours/:id', ({ params }) => {
        const id = Number(params.id);
        const parcours = parcoursStore.find((p) => p.ID === id);
        
        if (!parcours) {
            return HttpResponse.json({ message: 'Parcours not found' }, { status: 404 });
        }
        
        return HttpResponse.json(parcours);
    }),
    
    http.post('/api/Parcours', async ({ request }) => {
        const body = (await request.json()) as Parcours;
        const newParcours: Parcours = {
            ...body,
            ID: getNextId(),
        };
        
        parcoursStore = [newParcours, ...parcoursStore];
        return HttpResponse.json(newParcours, { status: 201 });
    }),
    
    http.put('/api/Parcours/:id', async ({ params, request }) => {
        const id = Number(params.id);
        const updates = (await request.json()) as Parcours;
        const index = parcoursStore.findIndex((p) => p.ID === id);
        
        if (index === -1) {
            return HttpResponse.json({ message: 'Parcours not found' }, { status: 404 });
        }
        
        const updated: Parcours = { ...parcoursStore[index], ...updates, ID: id };
        parcoursStore[index] = updated;
        
        return HttpResponse.json(updated);
    }),
    
    http.delete('/api/Parcours/:id', ({ params }) => {
        const id = Number(params.id);
        const exists = parcoursStore.some((p) => p.ID === id);
        
        if (!exists) {
            return HttpResponse.json({ message: 'Parcours not found' }, { status: 404 });
        }
        
        parcoursStore = parcoursStore.filter((p) => p.ID !== id);
        return new HttpResponse(null, { status: 204 });
    }),
];
