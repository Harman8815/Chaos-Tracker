import React from 'react';
import type { Tracker, Habit, ScoringRule } from './types';
import { v4 as uuidv4 } from 'uuid';
import { LayoutGrid, TrendingUp, BookOpen, Wallet, Target, Quote, Trophy } from 'lucide-react';

export const TRACKERS: Tracker[] = [
    { id: 'planner', name: 'Planner', icon: LayoutGrid },
    { id: 'points', name: 'Points', icon: TrendingUp },
    { id: 'journal', name: 'Journal', icon: BookOpen },
    { id: 'expense', name: 'Expenses', icon: Wallet },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'quotes', name: 'Quotes', icon: Quote },
    { id: 'achievements', name: 'Achievements', icon: Trophy },
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