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
    // FIX: Added optional 'completed' property to track habit status for a given day.
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

export type PageId = 'home' | 'dashboard' | 'habits' | 'points' | 'journal' | 'settings';

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