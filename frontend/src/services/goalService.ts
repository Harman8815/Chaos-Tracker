import { client as apiClient } from '../api/client';
import { Goal, GoalCategory, GoalStatus, GoalPriority, GoalFrequency } from '../types';

export interface GoalListResponse {
  success: boolean;
  count: number;
  goals: Goal[];
}

export interface CreateGoalPayload {
  text: string;
  category: GoalCategory;
  tags?: string[];
  target?: number;
  completed_tasks?: number;
  status?: GoalStatus;
  description?: string;
  start_date?: string;
  due_date?: string;
  priority?: GoalPriority;
  frequency?: GoalFrequency;
  reminders?: string[];
  completion_criteria?: string;
  notes?: string;
}

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

export const createGoal = async (
  goalData: CreateGoalPayload
): Promise<GoalListResponse> => {
  return await apiClient.post<GoalListResponse>('/goals/', goalData);
};

export const updateGoal = async (
  goalId: number,
  updates: Partial<Goal>
): Promise<{ success: boolean; message: string; goal: Goal }> => {
  return await apiClient.patch<{ success: boolean; message: string; goal: Goal }>(
    `/goals/${goalId}/`,
    updates
  );
};

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
