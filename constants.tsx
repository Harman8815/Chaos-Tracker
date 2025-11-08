
import React from 'react';
import type { Tracker, Habit, Mood } from './types';

const CheckSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
);
const SmileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
);
const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

export const TRACKERS: Tracker[] = [
    { id: 'habits', name: 'Habits', icon: <CheckSquareIcon /> },
    { id: 'mood', name: 'Mood', icon: <SmileIcon /> },
    { id: 'journal', name: 'Journal', icon: <BookOpenIcon /> },
];

export const DEFAULT_HABITS: Omit<Habit, 'completed'>[] = [
    { id: 'read', name: 'Read for 15 minutes' },
    { id: 'exercise', name: 'Exercise for 30 minutes' },
    { id: 'meditate', name: 'Meditate for 10 minutes' },
    { id: 'no_junk_food', name: 'No junk food' },
];

export const MOOD_OPTIONS: { mood: Mood; emoji: string; color: string }[] = [
    { mood: 'ecstatic', emoji: '🤩', color: 'text-green-400' },
    { mood: 'happy', emoji: '😊', color: 'text-lime-400' },
    { mood: 'neutral', emoji: '😐', color: 'text-yellow-400' },
    { mood: 'sad', emoji: '😕', color: 'text-blue-400' },
    { mood: 'awful', emoji: '😠', color: 'text-red-400' },
];
