import type { Parcours } from '../entities/Parcours';
import type { IDAO } from './IDAO';
import axios from 'axios'; 

export class ParcoursDAO implements IDAO<Parcours> {
    private static instance: ParcoursDAO;
    
    private constructor() {}
    
    public static getInstance(): ParcoursDAO {
        if (!ParcoursDAO.instance) {
            ParcoursDAO.instance = new ParcoursDAO();
        }
        return ParcoursDAO.instance;
    }
    
    public async create(data: Parcours): Promise<Parcours> {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Parcours`, data);
            return response.data;
        } catch (error) {
            throw new Error('Impossible de créer le nouveau parcours');
        }
    }
    
    public async get(id: number): Promise<Parcours> {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Parcours/${id}`);
            return response.data as Parcours;
        } catch (error) {
            throw new Error('Impossible de récupérer le parcours');
        }
    }
    
    public async update(id: number, data: Parcours): Promise<Parcours> {
        // Update a Parcours document in the database
        return data;
    }
    
    public async delete(id: number): Promise<void> {
        // Delete a Parcours document from the database
    }
    
    public async list(): Promise<Parcours[]> {
        try {
            // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Parcours`);
            const response = await axios.get(`/dataTest.json`);
            return response.data as Parcours[];
        } catch (error) {
            throw new Error('Impossible de lister les parcours');
        }
    }
}
