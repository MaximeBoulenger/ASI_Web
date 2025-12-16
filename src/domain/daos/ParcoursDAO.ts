import axios from 'axios';
import type { Parcours } from '../entities/Parcours';
import type { IDAO } from './IDAO';

export class ParcoursDAO implements IDAO<Parcours> {
  private static instance: ParcoursDAO;
  // Use relative URL so MSW intercepts in dev and the app hits the current origin in prod
  private readonly baseUrl = '/api/Parcours';

  private constructor() {}

  public static getInstance(): ParcoursDAO {
    if (!ParcoursDAO.instance) {
      ParcoursDAO.instance = new ParcoursDAO();
    }
    return ParcoursDAO.instance;
  }

  public async create(data: Parcours): Promise<Parcours> {
    try {
      const response = await axios.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      throw new Error('Impossible de creer le nouveau parcours');
    }
  }

  public async get(id: number): Promise<Parcours> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data as Parcours;
    } catch (error) {
      throw new Error('Impossible de recuperer le parcours');
    }
  }

  public async update(id: number, data: Parcours): Promise<Parcours> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, data);
      return response.data as Parcours;
    } catch (error) {
      throw new Error('Impossible de mettre a jour le parcours');
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw new Error('Impossible de supprimer le parcours');
    }
  }

  public async list(): Promise<Parcours[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data as Parcours[];
    } catch (error) {
      throw new Error('Impossible de lister les parcours');
    }
  }
}
