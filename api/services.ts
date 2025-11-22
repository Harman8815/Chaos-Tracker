
import { client } from './client';
import { ENDPOINTS } from './constants';
import { AllData, Habit, PlannerData, GoalData, Expense, QuoteSource, Achievement, UserProfile, ScoringRule } from '../types';

export interface AppDataResponse {
    data?: AllData;
    habits?: Habit[];
    rules?: ScoringRule[];
    planner?: PlannerData;
    goals?: GoalData;
    expenses?: Expense[];
    quotes?: QuoteSource[];
    achievements?: Achievement[];
    userProfile?: UserProfile;
}

/**
 * Fetches all application data from the backend.
 * Returns null if the request fails, triggering the local storage fallback in the UI.
 */
export const fetchAppData = async (): Promise<AppDataResponse | null> => {
    try {
        // Simulating a consolidated sync endpoint.
        // In a real scenario, this might be Promise.all() calls to multiple endpoints.
        const response = await client.get<AppDataResponse>(ENDPOINTS.SYNC);
        return response;
    } catch (error) {
        console.warn('API unavailable or failed. Falling back to local storage data.', error);
        return null;
    }
};

export const syncUserProfile = async (profile: UserProfile) => {
    try {
        return await client.post(ENDPOINTS.USER_PROFILE, profile);
    } catch (error) {
        console.warn('Failed to sync user profile to server.', error);
        return null;
    }
};
