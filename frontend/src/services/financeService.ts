import { client as apiClient } from '../api/client';
import { 
  Income, 
  Account, 
  AccountSummary, 
  RecurringExpense, 
  Transfer, 
  Subscription, 
  SubscriptionSummary, 
  BudgetAlert, 
  Budget, 
  BudgetActualVsBudget 
} from '../types';

/**
 * Finance Service - Handles all API calls for expanded finance features
 * Income, Accounts, Recurring Expenses, Transfers, Subscriptions, Budget Alerts, Budgets
 */

// ==================== INCOME ====================

export interface IncomeListResponse {
  count: number;
  total_amount: number;
  source_breakdown: Record<string, number>;
  incomes: Income[];
}

export interface IncomeSummary {
  summary: {
    total_income: number;
    total_amount: number;
    average_per_income: number;
    sources_count: number;
    unique_sources: string[];
  };
}

export const getAllIncomes = async (params?: {
  year?: number;
  month?: number;
  source?: string;
  start_date?: string;
  end_date?: string;
}): Promise<IncomeListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  if (params?.source) queryParams.append('source', params.source);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  const queryString = queryParams.toString();
  const endpoint = `/income/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get<IncomeListResponse>(endpoint);
};

export const getIncomeById = async (id: string): Promise<{ income: Income }> => {
  return await apiClient.get<{ income: Income }>(`/income/${id}/`);
};

export const createIncome = async (incomeData: Omit<Income, 'id'>): Promise<IncomeListResponse> => {
  const payload = {
    date: incomeData.date,
    source: incomeData.source,
    amount: incomeData.amount,
    description: incomeData.description,
  };
  return await apiClient.post<IncomeListResponse>('/income/', payload);
};

export const updateIncome = async (
  incomeId: string,
  updates: Partial<Income>
): Promise<{ message: string; income: Income }> => {
  const payload: any = {};
  if (updates.date) payload.date = updates.date;
  if (updates.source) payload.source = updates.source;
  if (updates.amount !== undefined) payload.amount = updates.amount;
  if (updates.description !== undefined) payload.description = updates.description;
  return await apiClient.patch<{ message: string; income: Income }>(`/income/${incomeId}/`, payload);
};

export const deleteIncome = async (incomeId: string): Promise<void> => {
  await apiClient.delete(`/income/${incomeId}/`);
};

export const getIncomeSummary = async (params?: {
  year?: number;
  month?: number;
  source?: string;
  start_date?: string;
  end_date?: string;
}): Promise<IncomeSummary> => {
  const queryParams = new URLSearchParams();
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  if (params?.source) queryParams.append('source', params.source);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  const queryString = queryParams.toString();
  const endpoint = `/income/summary/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get<IncomeSummary>(endpoint);
};

export const getIncomeMonthlyStats = async (year?: number): Promise<{ year: number; total_amount: number; monthly_stats: any[] }> => {
  const queryString = year ? `?year=${year}` : '';
  const endpoint = `/income/monthly-stats/${queryString}`;
  return await apiClient.get(endpoint);
};

// ==================== ACCOUNTS ====================

export const getAllAccounts = async (isActive?: boolean): Promise<{ data: Account[]; count: number }> => {
  const queryParams = new URLSearchParams();
  if (isActive !== undefined) queryParams.append('is_active', isActive.toString());
  const queryString = queryParams.toString();
  const endpoint = `/accounts/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get(endpoint);
};

export const getAccountById = async (id: string): Promise<{ account: Account }> => {
  return await apiClient.get<{ account: Account }>(`/accounts/${id}/`);
};

export const createAccount = async (accountData: Omit<Account, 'id'>): Promise<{ account: Account }> => {
  return await apiClient.post<{ account: Account }>('/accounts/', accountData);
};

export const updateAccount = async (
  accountId: string,
  updates: Partial<Account>
): Promise<{ message: string; account: Account }> => {
  return await apiClient.patch<{ message: string; account: Account }>(`/accounts/${accountId}/`, updates);
};

export const deleteAccount = async (accountId: string): Promise<void> => {
  await apiClient.delete(`/accounts/${accountId}/`);
};

export const getAccountSummary = async (): Promise<{ summary: AccountSummary }> => {
  return await apiClient.get<{ summary: AccountSummary }>('/accounts/summary/');
};

// ==================== RECURRING EXPENSES ====================

export interface RecurringExpenseListResponse {
  count: number;
  data: RecurringExpense[];
}

export const getAllRecurringExpenses = async (isActive?: boolean): Promise<RecurringExpenseListResponse> => {
  const queryParams = new URLSearchParams();
  if (isActive !== undefined) queryParams.append('is_active', isActive.toString());
  const queryString = queryParams.toString();
  const endpoint = `/recurring-expenses/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get(endpoint);
};

export const getRecurringExpenseById = async (id: string): Promise<{ recurring_expense: RecurringExpense }> => {
  return await apiClient.get<{ recurring_expense: RecurringExpense }>(`/recurring-expenses/${id}/`);
};

export const createRecurringExpense = async (data: Omit<RecurringExpense, 'id' | 'total' | 'next_occurrence'>): Promise<{ recurring_expense: RecurringExpense }> => {
  return await apiClient.post<{ recurring_expense: RecurringExpense }>('/recurring-expenses/', data);
};

export const updateRecurringExpense = async (
  id: string,
  updates: Partial<RecurringExpense>
): Promise<{ message: string; recurring_expense: RecurringExpense }> => {
  return await apiClient.patch<{ message: string; recurring_expense: RecurringExpense }>(`/recurring-expenses/${id}/`, updates);
};

export const deleteRecurringExpense = async (id: string): Promise<void> => {
  await apiClient.delete(`/recurring-expenses/${id}/`);
};

export const processRecurringExpenses = async (): Promise<{ created_expenses: any[]; count: number }> => {
  return await apiClient.post('/recurring-expenses/process/', {});
};

// ==================== TRANSFERS ====================

export interface TransferListResponse {
  count: number;
  total_amount: number;
  type_breakdown: Record<string, number>;
  transfers: Transfer[];
}

export const getAllTransfers = async (params?: {
  year?: number;
  month?: number;
  transfer_type?: string;
  start_date?: string;
  end_date?: string;
}): Promise<TransferListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  if (params?.transfer_type) queryParams.append('transfer_type', params.transfer_type);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  const queryString = queryParams.toString();
  const endpoint = `/transfers/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get<TransferListResponse>(endpoint);
};

export const getTransferById = async (id: string): Promise<{ transfer: Transfer }> => {
  return await apiClient.get<{ transfer: Transfer }>(`/transfers/${id}/`);
};

export const createTransfer = async (transferData: Omit<Transfer, 'id' | 'from_account_name' | 'to_account_name'>): Promise<{ transfer: Transfer }> => {
  return await apiClient.post<{ transfer: Transfer }>('/transfers/', transferData);
};

export const updateTransfer = async (
  transferId: string,
  updates: Partial<Transfer>
): Promise<{ message: string; transfer: Transfer }> => {
  return await apiClient.patch<{ message: string; transfer: Transfer }>(`/transfers/${transferId}/`, updates);
};

export const deleteTransfer = async (transferId: string): Promise<void> => {
  await apiClient.delete(`/transfers/${transferId}/`);
};

export const getTransferSummary = async (params?: {
  year?: number;
  month?: number;
  transfer_type?: string;
  start_date?: string;
  end_date?: string;
}): Promise<{ summary: { total_transfers: number; total_amount: number; types_count: number; unique_types: string[] } }> => {
  const queryParams = new URLSearchParams();
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  if (params?.transfer_type) queryParams.append('transfer_type', params.transfer_type);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  const queryString = queryParams.toString();
  const endpoint = `/transfers/summary/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get(endpoint);
};

// ==================== SUBSCRIPTIONS ====================

export interface SubscriptionListResponse {
  count: number;
  data: Subscription[];
}

export const getAllSubscriptions = async (status?: string): Promise<SubscriptionListResponse> => {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status);
  const queryString = queryParams.toString();
  const endpoint = `/subscriptions/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get(endpoint);
};

export const getSubscriptionById = async (id: string): Promise<{ subscription: Subscription }> => {
  return await apiClient.get<{ subscription: Subscription }>(`/subscriptions/${id}/`);
};

export const createSubscription = async (data: Omit<Subscription, 'id'>): Promise<{ subscription: Subscription }> => {
  return await apiClient.post<{ subscription: Subscription }>('/subscriptions/', data);
};

export const updateSubscription = async (
  id: string,
  updates: Partial<Subscription>
): Promise<{ message: string; subscription: Subscription }> => {
  return await apiClient.patch<{ message: string; subscription: Subscription }>(`/subscriptions/${id}/`, updates);
};

export const deleteSubscription = async (id: string): Promise<void> => {
  await apiClient.delete(`/subscriptions/${id}/`);
};

export const getSubscriptionSummary = async (): Promise<{ summary: SubscriptionSummary }> => {
  return await apiClient.get<{ summary: SubscriptionSummary }>('/subscriptions/summary/');
};

export const getUpcomingSubscriptions = async (days: number = 30): Promise<{ data: Subscription[]; count: number }> => {
  return await apiClient.get(`/subscriptions/upcoming/?days=${days}`);
};

// ==================== BUDGET ALERTS ====================

export interface BudgetAlertListResponse {
  count: number;
  data: BudgetAlert[];
}

export const getAllBudgetAlerts = async (params?: {
  is_read?: boolean;
  is_dismissed?: boolean;
}): Promise<BudgetAlertListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());
  if (params?.is_dismissed !== undefined) queryParams.append('is_dismissed', params.is_dismissed.toString());
  const queryString = queryParams.toString();
  const endpoint = `/budget-alerts/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get(endpoint);
};

export const getBudgetAlertById = async (id: string): Promise<{ alert: BudgetAlert }> => {
  return await apiClient.get<{ alert: BudgetAlert }>(`/budget-alerts/${id}/`);
};

export const markBudgetAlertRead = async (id: string): Promise<{ alert: BudgetAlert; message: string }> => {
  return await apiClient.post<{ alert: BudgetAlert; message: string }>(`/budget-alerts/${id}/read/`, {});
};

export const dismissBudgetAlert = async (id: string): Promise<{ alert: BudgetAlert; message: string }> => {
  return await apiClient.post<{ alert: BudgetAlert; message: string }>(`/budget-alerts/${id}/dismiss/`, {});
};

export const markAllBudgetAlertsRead = async (): Promise<{ marked_count: number; message: string }> => {
  return await apiClient.post<{ marked_count: number; message: string }>('/budget-alerts/mark-all-read/', {});
};

export const checkBudgetAlerts = async (year: number, month: number): Promise<{ created_alerts: BudgetAlert[]; count: number }> => {
  return await apiClient.post<{ created_alerts: BudgetAlert[]; count: number }>('/budget-alerts/check/', { year, month });
};

export const getBudgetAlertUnreadCount = async (): Promise<{ unread_count: number }> => {
  return await apiClient.get<{ unread_count: number }>('/budget-alerts/unread-count/');
};

// ==================== BUDGETS ====================

export interface BudgetListResponse {
  count: number;
  data: Budget[];
}

export const getAllBudgets = async (params?: {
  year?: number;
  month?: number;
  category?: string;
}): Promise<BudgetListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.year !== undefined) queryParams.append('year', params.year.toString());
  if (params?.month !== undefined) queryParams.append('month', params.month.toString());
  if (params?.category) queryParams.append('category', params.category);
  const queryString = queryParams.toString();
  const endpoint = `/budgets/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get(endpoint);
};

export const getBudgetById = async (id: string): Promise<{ budget: Budget }> => {
  return await apiClient.get<{ budget: Budget }>(`/budgets/${id}/`);
};

export const createBudget = async (data: Omit<Budget, 'id' | 'period'>): Promise<{ budget: Budget }> => {
  return await apiClient.post<{ budget: Budget }>('/budgets/', data);
};

export const updateBudget = async (
  id: string,
  updates: Partial<Budget>
): Promise<{ message: string; budget: Budget }> => {
  return await apiClient.patch<{ message: string; budget: Budget }>(`/budgets/${id}/`, updates);
};

export const deleteBudget = async (id: string): Promise<void> => {
  await apiClient.delete(`/budgets/${id}/`);
};

export const getBudgetActualVsBudget = async (year: number, month: number, category?: string): Promise<BudgetActualVsBudget> => {
  const queryParams = new URLSearchParams();
  queryParams.append('year', year.toString());
  queryParams.append('month', month.toString());
  if (category) queryParams.append('category', category);
  const queryString = queryParams.toString();
  const endpoint = `/budgets/actual-vs-budget/${queryString ? '?' + queryString : ''}`;
  return await apiClient.get<BudgetActualVsBudget>(endpoint);
};

// ==================== EXPORT ====================

const financeService = {
  // Income
  getAllIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeSummary,
  getIncomeMonthlyStats,
  
  // Accounts
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountSummary,
  
  // Recurring Expenses
  getAllRecurringExpenses,
  getRecurringExpenseById,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  processRecurringExpenses,
  
  // Transfers
  getAllTransfers,
  getTransferById,
  createTransfer,
  updateTransfer,
  deleteTransfer,
  getTransferSummary,
  
  // Subscriptions
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionSummary,
  getUpcomingSubscriptions,
  
  // Budget Alerts
  getAllBudgetAlerts,
  getBudgetAlertById,
  markBudgetAlertRead,
  dismissBudgetAlert,
  markAllBudgetAlertsRead,
  checkBudgetAlerts,
  getBudgetAlertUnreadCount,
  
  // Budgets
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetActualVsBudget,
};

export default financeService;