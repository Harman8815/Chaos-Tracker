import React from 'react';

export type Mood = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'awful';

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

export interface Tracker {
  // fix: Use a specific union of string literals for id, which is a subset of PageId.
  id: 'habits' | 'mood' | 'journal';
  name: string;
  icon: React.ReactElement;
}

export interface DailyData {
  habits?: Habit[];
  mood?: Mood;
  journal?: string;
}

export type AllData = Record<string, DailyData>;

// Navigation Type
export type PageId = 'home' | 'dashboard' | 'habits' | 'mood' | 'journal';


// Settings Types
export type Theme = 'light' | 'dark';
export type TimeFormat = '12h' | '24h';
export type Language = 'en' | 'es' | 'de';

export interface Settings {
    theme: Theme;
    timeFormat: TimeFormat;
    language: Language;
}