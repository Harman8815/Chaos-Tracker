import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../App';
import Card from '../ui/Card';
import type { DailyData, Habit } from '../../types';
import { DEFAULT_HABITS } from '../../constants';

interface HabitTrackerProps {
    todayData: DailyData;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ todayData }) => {
    const dataContext = useContext(DataContext);
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        if (todayData.habits) {
            setHabits(todayData.habits);
        } else {
            const initialHabits = DEFAULT_HABITS.map(h => ({ ...h, completed: false }));
            setHabits(initialHabits);
        }
    }, [todayData.habits]);
    
    const toggleHabit = (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        const updatedHabits = habits.map(habit =>
            habit.id === id ? { ...habit, completed: !habit.completed } : habit
        );
        setHabits(updatedHabits);
        dataContext?.updateData(today, { habits: updatedHabits });
    };

    return (
        <Card>
            <h2 className="text-xl font-semibold text-light-text-primary dark:text-text-primary mb-4">Today's Habits</h2>
            <div className="space-y-3">
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        onClick={() => toggleHabit(habit.id)}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                            habit.completed 
                            ? 'bg-accent/10 border-accent/30 dark:bg-accent/20 dark:border-accent' 
                            : 'bg-light-primary dark:bg-primary border-light-border-color dark:border-border-color'
                        }`}
                    >
                        <div className={`w-6 h-6 rounded-md border-2 ${habit.completed ? 'bg-accent border-accent' : 'border-light-text-secondary dark:border-text-secondary'} flex items-center justify-center mr-4`}>
                            {habit.completed && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            )}
                        </div>
                        <span className={`font-medium ${habit.completed ? 'text-light-text-primary dark:text-text-primary line-through' : 'text-light-text-secondary dark:text-text-secondary'}`}>
                            {habit.name}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default HabitTracker;