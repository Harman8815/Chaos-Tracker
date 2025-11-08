// FIX: Corrected import paths for types and constants.
import { AllData } from '../types';
import { DEFAULT_HABITS } from '../constants';

const generatePastData = (): AllData => {
    const data: AllData = {};
    const today = new Date();
    for (let i = 90; i > 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const habits = DEFAULT_HABITS.map(h => ({
            ...h,
            completed: Math.random() > 0.4
        }));

        const habitScores: { [habitId: string]: number } = {};
        DEFAULT_HABITS.forEach(habit => {
            habitScores[habit.id] = Math.floor(Math.random() * 11);
        });
        
        const totalPoints = Math.round(Object.values(habitScores).reduce((sum, score) => sum + score, 0) / DEFAULT_HABITS.length);

        data[dateString] = {
            habits,
            points: totalPoints,
            journal: i % 5 === 0 ? `This is a journal entry for ${dateString}. Feeling pretty good about my progress.` : '',
            habitScores
        };
    }
    return data;
};

export const DUMMY_DATA: AllData = generatePastData();