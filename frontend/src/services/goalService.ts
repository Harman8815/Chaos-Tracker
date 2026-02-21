import { client as apiClient } from '../api/client';
import { Goal, GoalCategory, GoalStatus } from '../types';

/**
 * Goal Service - Handles all API calls for goal management
 */

export interface GoalListResponse {
  success: boolean;
  count: number;
  goals: Goal[];
}

/**
 * Get all goals with optional filters
 */
export const getAllGoals = async (params?: {
  category?: GoalCategory;
  status?: GoalStatus;
}): Promise<GoalListResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.category) queryParams.append('category', params.category);
  if (params?.status) queryParams.append('status', params.status);
  
  const queryString = queryParams.toString();
  const endpoint = `/goals/${queryString ? '?' + queryString : ''}`;
  
  return await apiClient.get<GoalListResponse>(endpoint);
};

/**
 * Create a new goal
 */
export const createGoal = async (
  goalData: { text: string; category: GoalCategory; tags?: string[] }
): Promise<GoalListResponse> => {
  return await apiClient.post<GoalListResponse>('/goals/', goalData);
};

/**
 * Update a goal (status, text, etc.)
 */
export const updateGoal = async (
  goalId: number,
  updates: Partial<Goal>
): Promise<{ success: boolean; message: string; goal: Goal }> => {
  return await apiClient.patch<{ success: boolean; message: string; goal: Goal }>(
    `/goals/${goalId}/`,
    updates
  );
};

/**
 * Delete a goal
 */
export const deleteGoal = async (goalId: number): Promise<void> => {
  await apiClient.delete(`/goals/${goalId}/`);
};

const goalService = {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};

export default goalService;
