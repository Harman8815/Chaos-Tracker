import { client } from '../api/client';

export interface WaterEntry {
  id: number;
  date: string;
  glasses: number;
  target: number;
  created_at: string;
  updated_at: string;
}

export interface CreateWaterPayload {
  date: string;
  glasses: number;
  target?: number;
}

export const waterService = {
  async getAll(): Promise<WaterEntry[]> {
    const response = await client.get<WaterEntry[]>('/water/');
    return response;
  },

  async getById(id: number): Promise<WaterEntry> {
    const response = await client.get<WaterEntry>(`/water/${id}/`);
    return response;
  },

  async create(payload: CreateWaterPayload): Promise<WaterEntry> {
    const response = await client.post<WaterEntry>('/water/', payload);
    return response;
  },

  async update(id: number, payload: Partial<CreateWaterPayload>): Promise<WaterEntry> {
    const response = await client.patch<WaterEntry>(`/water/${id}/`, payload);
    return response;
  },

  async delete(id: number): Promise<void> {
    await client.delete(`/water/${id}/`);
  },
};
