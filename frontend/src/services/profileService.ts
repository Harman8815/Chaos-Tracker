import { client } from '../api/client';
import { ENDPOINTS } from '../api/constants';

export interface UserProfile {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    bio: string;
    avatar_url: string;
    date_of_birth: string | null;
    location: string;
    website: string;
    timezone: string;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdateData {
    bio?: string;
    avatar_url?: string;
    date_of_birth?: string;
    location?: string;
    website?: string;
    timezone?: string;
    first_name?: string;
    last_name?: string;
}

/**
 * Profile Service
 * Handles all API calls related to user profile management
 */
export const profileService = {
    /**
     * Get current user's profile
     */
    async getProfile(): Promise<UserProfile | null> {
        try {
            const response = await client.get<UserProfile>(ENDPOINTS.USER_PROFILE);
            return response;
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            return null;
        }
    },

    /**
     * Update user profile (full update)
     */
    async updateProfile(profileData: ProfileUpdateData): Promise<UserProfile | null> {
        try {
            const response = await client.put<UserProfile>(ENDPOINTS.USER_PROFILE, profileData);
            return response;
        } catch (error) {
            console.error('Failed to update user profile:', error);
            return null;
        }
    },

    /**
     * Partially update user profile
     */
    async patchProfile(profileData: Partial<ProfileUpdateData>): Promise<UserProfile | null> {
        try {
            const response = await client.patch<UserProfile>(ENDPOINTS.USER_PROFILE, profileData);
            return response;
        } catch (error) {
            console.error('Failed to patch user profile:', error);
            return null;
        }
    }
};
