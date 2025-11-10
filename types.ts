export type Theme = 'light' | 'dark';
export type TimeFormat = '12h' | '24h';
export type Language = 'en' | 'es' | 'fr';

export interface Settings {
    theme: Theme;
    timeFormat: TimeFormat;
    language: Language;
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
    points: number;
    journal: string;
    habitScores?: { [habitId: string]: number };
}

export type AllData = {
    [date: string]: DailyData;
};

// FIX: Added 'pedometer' to the PageId type to support the Pedometer component.
export type PageId = 'home' | 'dashboard' | 'planner' | 'points' | 'journal' | 'settings' | 'expense' | 'goals' | 'quotes' | 'pedometer';

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