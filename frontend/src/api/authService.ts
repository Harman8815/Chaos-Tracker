import { client } from './client';
import { ENDPOINTS } from './constants';

/**
 * User data structure returned from Django backend
 */
export interface User {
    id: number;
    username: string;
    email: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
    username: string;
    password: string;
}

/**
 * Signup data
 */
export interface SignupData {
    username: string;
    email: string;
    password: string;
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: User;
    error?: string;
}

/**
 * Temp data response from backend
 */
export interface TempDataResponse {
    success: boolean;
    message?: string;
    timestamp?: string;
    data?: {
        expenses: number;
        goals: number;
        habits: number;
        journal_entries: number;
        months_generated: number;
        habit_scores_created: number;
        achievements_created: number;
    };
    error?: string;
}

/**
 * Authentication service for handling user authentication
 */
export const authService = {
    /**
     * Sign up a new user
     */
    signup: async (data: SignupData): Promise<AuthResponse> => {
        try {
            const response = await client.post<any>(ENDPOINTS.SIGNUP, data);
            return {
                success: response.success || true,
                user: response.user,
                message: response.message || 'Account created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Signup failed'
            };
        }
    },

    /**
     * Login an existing user
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const response = await client.post<any>(ENDPOINTS.LOGIN, credentials);
            return {
                success: response.success || true,
                user: response.user,
                message: response.message || 'Login successful'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Login failed'
            };
        }
    },

    /**
     * Logout current user
     */
    logout: async (): Promise<AuthResponse> => {
        try {
            const response = await client.post<any>(ENDPOINTS.LOGOUT, {});
            return {
                success: response.success || true,
                message: response.message || 'Logged out successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Logout failed'
            };
        }
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: async (): Promise<User | null> => {
        try {
            const response = await client.get<any>(ENDPOINTS.ME);
            return response.user || null;
        } catch (error) {
            console.warn('Not authenticated or session expired', error);
            return null;
        }
    },

    /**
     * Populate temporary data for testing (12 months of historical data)
     */
    populateTempData: async (): Promise<TempDataResponse> => {
        try {
            const response = await client.post<any>(ENDPOINTS.TEMP_DATA, {});
            return {
                success: response.success || true,
                message: response.message || 'Temporary data populated successfully',
                timestamp: response.timestamp,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to populate temporary data'
            };
        }
    }
};

