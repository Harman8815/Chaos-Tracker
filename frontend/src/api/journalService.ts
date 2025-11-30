import { client } from './client';
import { ENDPOINTS } from './constants';

export interface JournalEntry {
    id?: number;
    date: string;
    content: string;
    created_at?: string;
    updated_at?: string;
}

export const journalService = {
    /**
     * Get all journal entries for the current user
     */
    getAllEntries: async (): Promise<JournalEntry[]> => {
        try {
            const response = await client.get<JournalEntry[]>(ENDPOINTS.JOURNAL);
            return response;
        } catch (error) {
            console.error('Failed to fetch journal entries', error);
            throw error;
        }
    },

    /**
     * Get a specific journal entry by date
     */
    getEntryByDate: async (date: string): Promise<JournalEntry | null> => {
        try {
            const response = await client.get<JournalEntry>(`${ENDPOINTS.JOURNAL}${date}/`);
            return response;
        } catch (error) {
            // If 404, return null or empty entry
            return null;
        }
    },

    /**
     * Save (create or update) a journal entry for a specific date
     */
    saveEntry: async (date: string, content: string): Promise<JournalEntry> => {
        try {
            const response = await client.put<JournalEntry>(`${ENDPOINTS.JOURNAL}${date}/`, {
                content
            });
            return response;
        } catch (error) {
            console.error('Failed to save journal entry', error);
            throw error;
        }
    },
    
    /**
     * Delete a journal entry
     */
    deleteEntry: async (date: string): Promise<void> => {
        try {
            await client.delete(`${ENDPOINTS.JOURNAL}${date}/`);
        } catch (error) {
            console.error('Failed to delete journal entry', error);
            throw error;
        }
    }
};
