import React from 'react';
import type { Tracker, Habit, ScoringRule } from './types';
import { v4 as uuidv4 } from 'uuid';

const LayoutGridIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
);
const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
);
const GoalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 13V2l8 4-8 4"/><path d="M12 22v-8h8"/><path d="M4 12v8h8"/></svg>
);
const QuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v6c0 7 4 8 8 8Z"/><path d="M12 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 2v6c0 7 4 8 8 8Z"/></svg>
);
// FIX: Add a new icon for the Pedometer tracker.
const FootprintsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 16.8V11a2 2 0 1 1 4 0v5.8"/><path d="M5.4 13.4 8.6 15"/><path d="M15 21v-5.8a2 2 0 0 0-4 0V21"/><path d="M13.6 17.6 10.4 16"/></svg>
);

// FIX: Add the Pedometer to the list of available trackers.
export const TRACKERS: Tracker[] = [
    { id: 'planner', name: 'Planner', icon: LayoutGridIcon },
    { id: 'points', name: 'Points', icon: TrendingUpIcon },
    { id: 'journal', name: 'Journal', icon: BookOpenIcon },
    { id: 'expense', name: 'Expenses', icon: WalletIcon },
    { id: 'goals', name: 'Goals', icon: GoalIcon },
    { id: 'quotes', name: 'Quotes', icon: QuoteIcon },
    { id: 'pedometer', name: 'Pedometer', icon: FootprintsIcon },
];

export const DEFAULT_HABITS: Habit[] = [
    { id: 'wake_up', name: 'Wake up Early', target: 250, rangeMax: 10 },
    { id: 'exercise', name: 'Exercise', target: 200, rangeMax: 10 },
    { id: 'dsa', name: 'DSA Practice', target: 250, rangeMax: 10 },
    { id: 'dev', name: 'Development', target: 300, rangeMax: 10 },
    { id: 'pro_time', name: 'Pro-Time', target: 280, rangeMax: 10 },
    { id: 'learning', name: 'Learning', target: 200, rangeMax: 10 },
    { id: 'reading', name: 'Book Reading', target: 200, rangeMax: 10 },
    { id: 'games', name: 'Games', target: 300, rangeMax: 10 },
    { id: 'social', name: 'Social Media', target: 300, rangeMax: 10 },
];

export const DEFAULT_SCORING_RULES: ScoringRule[] = [
    { id: uuidv4(), activity: 'Wake up Early', maxPoints: 10, penaltyRule: '-1 per 30 mins after target wake time', zeroPointsCondition: 'Oversleep (12 hrs)', scoringLogic: 'Need ≥8 hrs sleep; points drop if waking too late' },
    { id: uuidv4(), activity: 'Exercise', maxPoints: 10, penaltyRule: 'No workout = 0', zeroPointsCondition: 'No exercise done', scoringLogic: '8 pts for workout intensity; +2 pts for stretching/mobility (keeps streak alive)' },
    { id: uuidv4(), activity: 'DSA Practice', maxPoints: 10, penaltyRule: 'No practice = 0', zeroPointsCondition: 'No DSA done', scoringLogic: 'Points based on number of questions solved' },
    { id: uuidv4(), activity: 'Development (Coding)', maxPoints: 10, penaltyRule: 'No coding = 0', zeroPointsCondition: 'No coding done', scoringLogic: '≥6 hrs → 10 points; major project in a day → 10; micro-commit/refactor → 5 points' },
    { id: uuidv4(), activity: 'Pro-Time (Research/Work)', maxPoints: 10, penaltyRule: '-1 for idle/wasted time', zeroPointsCondition: 'Entire time wasted', scoringLogic: 'Score depends on hours spent in research/career tasks' },
    { id: uuidv4(), activity: 'Learning (New Skills)', maxPoints: 10, penaltyRule: '-1 if skipped', zeroPointsCondition: 'No study done', scoringLogic: 'Input (study/course) → 5 pts; Output (notes/blog/demo) → +5 pts; ≥2 hrs total = 10' },
    { id: uuidv4(), activity: 'Book Reading', maxPoints: 10, penaltyRule: '-2 points per page less than 5', zeroPointsCondition: 'No reading done', scoringLogic: '5 pages = 8 pts; >5 pages → 10 points' },
    { id: uuidv4(), activity: 'Games', maxPoints: 10, penaltyRule: '-2 points per 10 mins played', zeroPointsCondition: 'Heavy gaming session', scoringLogic: 'No gaming → 10 points; 1 hr → 8, etc.' },
    { id: uuidv4(), activity: 'Social Media', maxPoints: 10, penaltyRule: '-2 points per 10 mins beyond 1 hr', zeroPointsCondition: 'Excessive scrolling', scoringLogic: '<1 hr → 10 points; >1 hr → lose points' },
];