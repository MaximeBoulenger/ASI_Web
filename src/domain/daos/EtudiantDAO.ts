import axios from 'axios';
import type { Etudiant } from '../entities/Etudiant';
import type { IDAO } from './IDAO';

export class EtudiantDAO implements IDAO<Etudiant> {
  private static instance: EtudiantDAO;
  private readonly baseUrl = '/api/Etudiants';

  private constructor() {}

  public static getInstance(): EtudiantDAO {
    if (!EtudiantDAO.instance) {
      EtudiantDAO.instance = new EtudiantDAO();
    }
    return EtudiantDAO.instance;
  }

  public async create(data: Etudiant): Promise<Etudiant> {
    try {
      const response = await axios.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      throw new Error('Impossible de creer le nouvel etudiant');
    }
  }

  public async get(id: number): Promise<Etudiant> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data as Etudiant;
    } catch (error) {
      throw new Error('Impossible de recuperer l etudiant');
    }
  }

  public async update(id: number, data: Etudiant): Promise<Etudiant> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, data);
      return response.data as Etudiant;
    } catch (error) {
      throw new Error('Impossible de mettre a jour l etudiant');
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw new Error('Impossible de supprimer l etudiant');
    }
  }

  public async list(): Promise<Etudiant[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data as Etudiant[];
    } catch (error) {
      throw new Error('Impossible de lister les etudiants');
    }
  }
}
