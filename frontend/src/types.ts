import React, { Dispatch, SetStateAction } from 'react';

export type Theme = 'light' | 'dark';
export type TimeFormat = '12h' | '24h';
export type Language = 'en' | 'es' | 'fr';
export type ThemeDensity = 'compact' | 'comfortable' | 'spacious';
export type FontFamily = 'sans' | 'serif' | 'mono';

export interface Settings {
    theme: Theme;
    timeFormat: TimeFormat;
    language: Language;
    notifications: boolean;
    accentColor?: string;
    fontFamily?: FontFamily;
    density?: ThemeDensity;
    reducedMotion?: boolean;
}

export interface UserProfile {
    name: string;
    email: string;
    joinDate: string;
    avatar?: string;
    bio?: string;
    location?: string;
    skills?: string[];
    socials?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
    }
}

export interface Habit {
    id: string;
    name: string;
    target: number;
    rangeMax?: number;
    completed?: boolean;
    streak?: number;
}

export interface DailyData {
    habits?: Habit[]; // This is legacy, can be removed if fully migrated
    journal: string;
    habitScores?: { [habitId: string]: number };
}

export type AllData = {
    [date: string]: DailyData;
};

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  images: string[];
  coverImage?: string; // Main image for grid view
}

export type PageId = 'home' | 'dashboard' | 'planner' | 'points' | 'journal' | 'settings' | 'expense' | 'goals' | 'quotes' | 'achievements' | 'profile' | 'edit-profile' | 'habits' | 'mood' | 'water';
export type ToolId = 'calculator' | 'clock' | 'chat';

export interface Tracker {
    id: PageId;
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ScoringRule {
    id: string;
    activity: string;
    maxPoints: number;
    penaltyRule: string;
    zeroPointsCondition: string;
    scoringLogic: string;
}

// Planner Types
export interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export interface TodoBlock {
    id: string;
    title: string;
    x: number;
    y: number;
    tasks: Task[];
}

export interface BlockLink {
    id: string;
    from: string;
    to: string;
}

export interface CanvasTransform {
    scale: number;
    panX: number;
    panY: number;
}

export interface PlannerData {
    blocks: TodoBlock[];
    links: BlockLink[];
    transform: CanvasTransform;
}

export interface Expense {
    id: string;
    date: string; // YYYY-MM-DD
    item: string;
    category: string;
    quantity: number;
    price: number; // Price per item
}

// ==================== FINANCE TYPES ====================

export type IncomeSource = 'salary' | 'freelance' | 'investment' | 'gift' | 'refund' | 'other';

export interface Income {
    id: string;
    date: string; // YYYY-MM-DD
    source: IncomeSource;
    amount: number;
    description?: string;
}

export type AccountType = 'checking' | 'savings' | 'credit' | 'cash' | 'investment' | 'other';

export interface Account {
    id: string;
    name: string;
    account_type: AccountType;
    balance: number;
    currency: string;
    is_active: boolean;
}

export interface AccountSummary {
    total_accounts: number;
    total_balance: number;
    type_breakdown: Record<string, number>;
}

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringExpense {
    id: string;
    item: string;
    category: string;
    quantity: number;
    price: number;
    total: number;
    frequency: RecurringFrequency;
    start_date: string;
    end_date?: string;
    day_of_month?: number;
    day_of_week?: number;
    next_occurrence: string;
    is_active: boolean;
}

export type TransferType = 'internal' | 'deposit' | 'withdrawal';
export type TransferStatus = 'pending' | 'completed' | 'cancelled';

export interface Transfer {
    id: string;
    from_account?: string;
    from_account_name?: string;
    to_account?: string;
    to_account_name?: string;
    amount: number;
    transfer_type: TransferType;
    status: TransferStatus;
    date: string;
    description?: string;
}

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';
export type SubscriptionStatus = 'active' | 'cancelled' | 'paused';

export interface Subscription {
    id: string;
    name: string;
    category: string;
    amount: number;
    billing_cycle: BillingCycle;
    next_billing_date: string;
    start_date: string;
    end_date?: string;
    status: SubscriptionStatus;
    description?: string;
}

export interface SubscriptionSummary {
    active_count: number;
    cancelled_count: number;
    paused_count: number;
    monthly_cost: number;
    category_breakdown: Record<string, number>;
}

export type BudgetAlertType = 'threshold' | 'exceeded' | 'projected';

export interface BudgetAlert {
    id: string;
    budget: string;
    budget_category: string;
    budget_amount: number;
    budget_period: string;
    alert_type: BudgetAlertType;
    threshold_percent: number;
    message: string;
    is_read: boolean;
    is_dismissed: boolean;
    triggered_at: string;
}

export interface Budget {
    id: string;
    category: string;
    year: number;
    month: number;
    amount: number;
    period: string;
}

export interface BudgetActualVsBudget {
    year: number;
    month: number;
    budgets: Array<{
        id: string;
        category: string;
        budget_amount: number;
        actual_amount: number;
        remaining: number;
        spent_percent: number;
        is_over_budget: boolean;
    }>;
    total_budget: number;
    total_actual: number;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  tags: string[];
  image?: string; // Optional image URL for the quote
}

export interface QuoteSource {
  id: string;
  title: string;
  type: 'Movie' | 'Web Series' | 'Book';
  coverImage: string; 
  quotes: Quote[];
}

// Goal Types
export type GoalStatus = 'active' | 'completed' | 'trashed' | 'blocked';
export type GoalCategory = 'daily' | 'monthly' | 'future';
export type GoalPriority = 'low' | 'medium' | 'high';
export type GoalFrequency = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Goal {
    id: number;
    text: string;
    status: GoalStatus;
    category: GoalCategory;
    created_at: string;
    completed_at?: string;
    tags?: string[];
    target: number;
    completed_tasks: number;
    description?: string;
    start_date?: string;
    due_date?: string;
    priority?: GoalPriority;
    frequency?: GoalFrequency;
    reminders?: string[];
    completion_criteria?: string;
    notes?: string;
}

export interface GoalData {
    daily: Goal[];
    monthly: Goal[];
    future: Goal[];
}


export interface DataContextType {
    data: AllData;
    setData: Dispatch<SetStateAction<AllData>>;
    selectedPage: PageId;
    setSelectedPage: Dispatch<SetStateAction<PageId>>;
    today: string;
    habits: Habit[];
    setHabits: Dispatch<SetStateAction<Habit[]>>;
    plannerData: PlannerData;
    setPlannerData: Dispatch<SetStateAction<PlannerData>>;
    goals: GoalData;
    setGoals: Dispatch<SetStateAction<GoalData>>;
    expenses: Expense[];
    setExpenses: Dispatch<SetStateAction<Expense[]>>;
    quotes: QuoteSource[];
    setQuotes: Dispatch<SetStateAction<QuoteSource[]>>;
    achievements: Achievement[];
    setAchievements: Dispatch<SetStateAction<Achievement[]>>;
    userProfile: UserProfile;
    setUserProfile: Dispatch<SetStateAction<UserProfile>>;
    dataLoading: boolean;
    setDataLoading: Dispatch<SetStateAction<boolean>>;
    logout: () => void;
}

// ==================== PHASE 11 — Advanced Experience TYPES ====================

export type DashboardWidgetId =
  | 'rank'
  | 'time'
  | 'streaks'
  | 'trend'
  | 'radar'
  | 'today-pie'
  | 'habit-streaks-bar'
  | 'monthly-avg'
  | 'weekly-perf'
  | 'target'
  | 'ai-reflection';

export interface DashboardWidgetConfig {
  id: DashboardWidgetId;
  enabled: boolean;
  x: number;
  y: number;
  w: number;
}

export interface DashboardLayout {
  widgets: DashboardWidgetConfig[];
  columns: number;
}

export interface RealtimeConfig {
  pollIntervalMs?: number;
  websocketUrl?: string;
}

export interface OfflineSyncStatus {
  online: boolean;
  pending: number;
  syncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}

export interface PointsData {
    habits: Habit[];
    rules: ScoringRule[];
    dailyData: {
        [date: string]: {
            habitScores: { [habitId: string]: number };
            journal: string;
        }
    };
}