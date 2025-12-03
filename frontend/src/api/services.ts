
import { client } from './client';
import { ENDPOINTS } from './constants';
import { AllData, Habit, PlannerData, GoalData, Expense, QuoteSource, Achievement, UserProfile, ScoringRule } from '../types';

// Re-export authentication service
export { authService } from './authService';
export type { User, LoginCredentials, SignupData, AuthResponse } from './authService';

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
        // Replace the single /sync call with parallel requests to existing endpoints.
        // Use Promise.allSettled so partial data can be returned if some endpoints fail.
        const [pointsRes, plannerRes, goalsRes, expensesRes, quotesRes, achievementsRes] = await Promise.allSettled([
            client.get<any>('/points/data/'),
            client.get<any>('/planner/'),
            client.get<any>('/goals/'),
            client.get<any>('/expenses/'),
            client.get<any>('/quotes/sources/'),
            client.get<any>('/achievements/'),
        ]);

        const aggregated: AppDataResponse = {};

        if (pointsRes.status === 'fulfilled' && pointsRes.value) {
            const pd = pointsRes.value as any;
            if (pd.data) aggregated.data = pd.data as any;
            if (pd.habits) aggregated.habits = pd.habits as any;
            if (pd.rules) aggregated.rules = pd.rules as any;
            // Some backends return combined object shapes; also accept `dailyData` or `points` naming
            if (!aggregated.data && pd.dailyData) aggregated.data = pd.dailyData as any;
        }

        if (plannerRes.status === 'fulfilled') aggregated.planner = plannerRes.value as any;
        if (goalsRes.status === 'fulfilled') aggregated.goals = goalsRes.value as any;
        if (expensesRes.status === 'fulfilled') aggregated.expenses = expensesRes.value as any;
        if (quotesRes.status === 'fulfilled') aggregated.quotes = quotesRes.value as any;
        if (achievementsRes.status === 'fulfilled') aggregated.achievements = achievementsRes.value as any;

        // Note: backend currently doesn't expose a user profile endpoint under tracker URLs,
        // so we don't attempt to fetch `userProfile` here to avoid calling non-existent endpoints.

        return aggregated;
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
