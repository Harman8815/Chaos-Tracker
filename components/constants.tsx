import React from 'react';
import type { Tracker, Habit } from './types';

const CheckSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
);
const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

export const TRACKERS: Tracker[] = [
    { id: 'habits', name: 'Habits', icon: CheckSquareIcon },
    { id: 'points', name: 'Points', icon: TrendingUpIcon },
    { id: 'journal', name: 'Journal', icon: BookOpenIcon },
];

export const DEFAULT_HABITS: Omit<Habit, 'completed'>[] = [
    { id: 'read', name: 'Read for 15 minutes', target: 200 },
    { id: 'exercise', name: 'Exercise for 30 minutes', target: 250 },
    { id: 'meditate', name: 'Meditate for 10 minutes', target: 150 },
    { id: 'no_junk_food', name: 'No junk food', target: 300 },
];
