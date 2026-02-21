import { client as apiClient } from '../api/client';
import { Expense } from '../types';

/**
 * Expense Service - Handles all API calls for expense management and analytics
 */

// ==================== TYPES ====================

export interface ExpenseListResponse {
  success: boolean;
  count: number;
  total_amount: number;
  category_breakdown: Record<string, number>;
  expenses: Expense[];
}

export interface ExpenseSummary {
  success: boolean;
  summary: {
    total_expenses: number;
    total_amount: number;
    average_per_expense: number;
    categories_count: number;
    unique_categories: string[];
  };
}

export interface CategoryBreakdown {
  success: boolean;
  count: number;
  categories: Array<{
    name: string;
    count: number;
    total: number;
  }>;
}

export interface ExpenseAnalytics {
  success: boolean;
  analytics: {
    year: number;
    month: number;
    days_in_month: number;
    total_amount: number;
    average_per_day: number;
    daily_breakdown: Array<{ day: number; total: number }>;
    category_breakdown: Array<{ name: string; value: number }>;
  };
}

export interface MonthlyStats {
  success: boolean;
  year: number;
  total_amount: number;
  monthly_stats: Array<{
    month: number;
    month_name: string;
    count: number;
    total: number;
  }>;
}

export interface TopExpenses {
  success: boolean;
  count: number;
  top_expenses: Array<{
    id: number;
    date: string;
    item: string;
    category: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

// ==================== CRUD OPERATIONS ====================

/**
 * Get all expenses with optional filters
 */
export const getAllExpenses = async (params?: {
  year?: number;
  month?: number;
  category?: string;
  start_date?: string;
  end_date?: string;
}): Promise<ExpenseListResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  
  const queryString = queryParams.toString();
  const endpoint = `/expenses/${queryString ? '?' + queryString : ''}`;
  
  return await apiClient.get<ExpenseListResponse>(endpoint);
};

/**
 * Get a specific expense by ID
 */
export const getExpenseById = async (id: string): Promise<{ success: boolean; expense: Expense }> => {
  return await apiClient.get<{ success: boolean; expense: Expense }>(`/expenses/${id}/`);
};

/**
 * Create a new expense
 */
export const createExpense = async (
  expenseData: Omit<Expense, 'id'>
): Promise<ExpenseListResponse> => {
  const payload = {
    date: expenseData.date,
    item: expenseData.item,
    category: expenseData.category,
    quantity: expenseData.quantity,
    price: expenseData.price,
  };

  return await apiClient.post<ExpenseListResponse>('/expenses/', payload);
};

/**
 * Update an expense
 */
export const updateExpense = async (
  expenseId: string,
  updates: Partial<Expense>
): Promise<{ success: boolean; message: string; expense: Expense }> => {
  const payload: any = {};
  
  if (updates.date) payload.date = updates.date;
  if (updates.item) payload.item = updates.item;
  if (updates.category) payload.category = updates.category;
  if (updates.quantity !== undefined) payload.quantity = updates.quantity;
  if (updates.price !== undefined) payload.price = updates.price;
  
  return await apiClient.patch<{ success: boolean; message: string; expense: Expense }>(
    `/expenses/${expenseId}/`,
    payload
  );

};

/**
 * Delete an expense
 */
export const deleteExpense = async (expenseId: string): Promise<void> => {
  await apiClient.delete(`/expenses/${expenseId}/`);
};

// ==================== ANALYTICS & STATISTICS ====================

/**
 * Get expense summary statistics
 */
export const getExpenseSummary = async (params?: {
  year?: number;
  month?: number;
  start_date?: string;
  end_date?: string;
}): Promise<ExpenseSummary> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  
  const queryString = queryParams.toString();
  const endpoint = `/expenses/summary/${queryString ? '?' + queryString : ''}`;
  
  return await apiClient.get<ExpenseSummary>(endpoint);
};

/**
 * Get category breakdown
 */
export const getExpenseCategories = async (params?: {
  year?: number;
  month?: number;
}): Promise<CategoryBreakdown> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `/expenses/categories/${queryString ? '?' + queryString : ''}`;
  
  return await apiClient.get<CategoryBreakdown>(endpoint);
};

/**
 * Get detailed expense analytics for a month
 */
export const getExpenseAnalytics = async (params?: {
  year?: number;
  month?: number;
}): Promise<ExpenseAnalytics> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `/expenses/analytics/${queryString ? '?' + queryString : ''}`;
  
  return await apiClient.get<ExpenseAnalytics>(endpoint);
};

/**
 * Get monthly statistics for entire year
 */
export const getMonthlyStats = async (year?: number): Promise<MonthlyStats> => {
  const queryString = year ? `?year=${year}` : '';
  const endpoint = `/expenses/monthly-stats/${queryString}`;
  
  return await apiClient.get<MonthlyStats>(endpoint);
};

/**
 * Get top expenses by amount
 */
export const getTopExpenses = async (params?: {
  limit?: number;
  year?: number;
  month?: number;
}): Promise<TopExpenses> => {
  const queryParams = new URLSearchParams();
  
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `/expenses/top-items/${queryString ? '?' + queryString : ''}`;
  
  return await apiClient.get<TopExpenses>(endpoint);
};

// ==================== EXPORT ====================

const expenseService = {
  // CRUD
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  
  // Analytics
  getExpenseSummary,
  getExpenseCategories,
  getExpenseAnalytics,
  getMonthlyStats,
  getTopExpenses,
};

export default expenseService;
