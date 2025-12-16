import axios from 'axios';
import type { UE } from '../entities/UE';
import type { IDAO } from './IDAO';

export class UEDAO implements IDAO<UE> {
  private static instance: UEDAO;
  private readonly baseUrl = '/api/UEs';
  
  private constructor() {}
  
  public static getInstance(): UEDAO {
    if (!UEDAO.instance) {
      UEDAO.instance = new UEDAO();
    }
    return UEDAO.instance;
  }
  
  public async create(data: UE): Promise<UE> {
    try {
      const response = await axios.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      throw new Error('Impossible de creer la nouvelle UE');
    }
  }
  
  public async get(id: number): Promise<UE> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data as UE;
    } catch (error) {
      throw new Error('Impossible de recuperer l UE');
    }
  }
  
  public async update(id: number, data: UE): Promise<UE> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, data);
      return response.data as UE;
    } catch (error) {
      throw new Error('Impossible de mettre a jour l UE');
    }
  }
  
  public async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw new Error('Impossible de supprimer l UE');
    }
  }
  
  public async list(): Promise<UE[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data as UE[];
    } catch (error) {
      throw new Error('Impossible de lister les UEs');
    }
  }
}
