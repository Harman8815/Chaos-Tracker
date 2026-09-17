import { client } from '../api/client';

export interface MoodEntry {
  id: number;
  date: string;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'tired' | 'grateful' | 'anxious' | 'energetic';
  created_at: string;
  updated_at: string;
}

export interface CreateMoodPayload {
  date: string;
  mood: MoodEntry['mood'];
}

export const moodService = {
  async getAll(): Promise<MoodEntry[]> {
    const response = await client.get<MoodEntry[]>('/mood/');
    return response;
  },

  async getById(id: number): Promise<MoodEntry> {
    const response = await client.get<MoodEntry>(`/mood/${id}/`);
    return response;
  },

  async create(payload: CreateMoodPayload): Promise<MoodEntry> {
    const response = await client.post<MoodEntry>('/mood/', payload);
    return response;
  },

  async update(id: number, payload: Partial<CreateMoodPayload>): Promise<MoodEntry> {
    const response = await client.patch<MoodEntry>(`/mood/${id}/`, payload);
    return response;
  },

  async delete(id: number): Promise<void> {
    await client.delete(`/mood/${id}/`);
  },
};
