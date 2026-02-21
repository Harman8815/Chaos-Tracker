import { client } from '../api/client';
import { ENDPOINTS } from '../api/constants';
import { PlannerData, TodoBlock } from '../types';

export interface PlannerResponse {
    success: boolean;
    planner?: PlannerData;
    message?: string;
}

export interface BlockResponse {
    success: boolean;
    block?: TodoBlock;
    message?: string;
}

/**
 * Planner Service
 * Handles all API calls related to the planner functionality
 */
export const plannerService = {
    /**
     * Get all planner data for the authenticated user
     */
    async getPlanner(): Promise<PlannerData | null> {
        try {
            const response = await client.get<PlannerResponse>(ENDPOINTS.PLANNER);
            return response.planner || null;
        } catch (error) {
            console.error('Failed to fetch planner data:', error);
            return null;
        }
    },

    /**
     * Update planner data (full replacement)
     */
    async updatePlanner(plannerData: PlannerData): Promise<boolean> {
        try {
            await client.put<PlannerResponse>(ENDPOINTS.PLANNER, plannerData);
            return true;
        } catch (error) {
            console.error('Failed to update planner data:', error);
            return false;
        }
    },

    /**
     * Partially update planner data
     */
    async patchPlanner(partialData: Partial<PlannerData>): Promise<boolean> {
        try {
            await client.patch<PlannerResponse>(ENDPOINTS.PLANNER, partialData);
            return true;
        } catch (error) {
            console.error('Failed to patch planner data:', error);
            return false;
        }
    },

    /**
     * Get a specific block by ID
     */
    async getBlock(blockId: string): Promise<TodoBlock | null> {
        try {
            const response = await client.get<BlockResponse>(`${ENDPOINTS.PLANNER}/blocks/${blockId}`);
            return response.block || null;
        } catch (error) {
            console.error(`Failed to fetch block ${blockId}:`, error);
            return null;
        }
    },

    /**
     * Update a specific block
     */
    async updateBlock(blockId: string, blockData: Partial<TodoBlock>): Promise<boolean> {
        try {
            await client.put<BlockResponse>(`${ENDPOINTS.PLANNER}/blocks/${blockId}`, blockData);
            return true;
        } catch (error) {
            console.error(`Failed to update block ${blockId}:`, error);
            return false;
        }
    },

    /**
     * Delete a specific block
     */
    async deleteBlock(blockId: string): Promise<boolean> {
        try {
            await client.delete(`${ENDPOINTS.PLANNER}/blocks/${blockId}`);
            return true;
        } catch (error) {
            console.error(`Failed to delete block ${blockId}:`, error);
            return false;
        }
    },

    /**
     * Sync planner data to backend (debounced save)
     * This is useful for auto-saving as the user interacts with the planner
     */
    async syncPlanner(plannerData: PlannerData): Promise<boolean> {
        try {
            await client.patch<PlannerResponse>(ENDPOINTS.PLANNER, plannerData);
            return true;
        } catch (error) {
            console.error('Failed to sync planner data:', error);
            return false;
        }
    }
};
