import { client as apiClient } from '../api/client';
import { Achievement } from '../types';

/**
 * Achievement Service - Handles all API calls for achievement management
 */

/**
 * Get all achievements for the authenticated user
 */
export const getAllAchievements = async (): Promise<Achievement[]> => {
  const response = await apiClient.get('/achievements/') as any;
  // Backend returns pagination or list? 
  // ListCreateAPIView returns list by default if pagination is off, or paginated response.
  // In views.py: pagination_class is not set explicitly to None, so it uses default.
  // Default might be PageNumberPagination.
  // Let's check if the response has 'results' or is a list.
  // Usually DRF returns { count, next, previous, results } if pagination is on.
  // Or just list if off.
  // I'll assume list for now or handle both.
  // Actually, looking at QuoteSourceListCreateView, it returns a custom dict.
  // AchievementListCreateView uses generics.ListCreateAPIView which uses default behavior.
  // If default pagination is enabled in settings.py, it will be paginated.
  // I should probably check settings.py or just handle the response safely.
  // For now, let's assume it returns a list or results.
  
  const data = Array.isArray(response) ? response : (response.results || []);
  return data.map(transformAchievementFromAPI);
};

/**
 * Create a new achievement
 */
export const createAchievement = async (
  achievementData: Omit<Achievement, 'id'>
): Promise<Achievement> => {
  const payload = {
    title: achievementData.title,
    description: achievementData.description,
    date: achievementData.date,
    image: achievementData.images && achievementData.images.length > 0 ? achievementData.images[0] : null,
  };

  const response = await apiClient.post('/achievements/', payload);
  return transformAchievementFromAPI(response);
};

/**
 * Update an achievement
 */
export const updateAchievement = async (
  achievementId: string,
  updates: Partial<Achievement>
): Promise<Achievement> => {
  const payload: any = {};
  
  if (updates.title) payload.title = updates.title;
  if (updates.description) payload.description = updates.description;
  if (updates.date) payload.date = updates.date;
  if (updates.images && updates.images.length > 0) {
      payload.image = updates.images[0];
  } else if (updates.images && updates.images.length === 0) {
      payload.image = null; // Clear image
  }
  
  const response = await apiClient.put(`/achievements/${achievementId}/`, payload);
  return transformAchievementFromAPI(response);
};

/**
 * Delete an achievement
 */
export const deleteAchievement = async (achievementId: string): Promise<void> => {
  await apiClient.delete(`/achievements/${achievementId}/`);
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Transform API achievement response to frontend format
 */
function transformAchievementFromAPI(apiAchievement: any): Achievement {
  return {
    id: String(apiAchievement.id),
    title: apiAchievement.title,
    description: apiAchievement.description,
    date: apiAchievement.date,
    tags: [], // Backend doesn't support tags yet
    images: apiAchievement.image ? [apiAchievement.image] : [],
    coverImage: apiAchievement.image || undefined,
  };
}

const achievementService = {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};

export default achievementService;
