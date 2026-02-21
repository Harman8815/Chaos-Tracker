import React, { Dispatch, SetStateAction } from 'react';

export type Theme = 'light' | 'dark';
export type TimeFormat = '12h' | '24h';
export type Language = 'en' | 'es' | 'fr';

export interface Settings {
    theme: Theme;
    timeFormat: TimeFormat;
    language: Language;
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

export type PageId = 'home' | 'dashboard' | 'planner' | 'points' | 'journal' | 'settings' | 'expense' | 'goals' | 'quotes' | 'achievements' | 'profile' | 'edit-profile';
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

export interface Goal {
    id: number; // Changed from string to number to match backend
    text: string;
    status: GoalStatus;
    category: GoalCategory;
    created_at: string;
    completed_at?: string;
    tags?: string[];
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
    logout: () => void;
}