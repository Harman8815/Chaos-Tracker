import React, { useContext } from 'react';
// FIX: Corrected import paths for context, constants, and types.
import { DataContext } from '../../App';
import { TRACKERS, DEFAULT_HABITS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import Card from '../ui/Card';
import { Habit } from '../../types';

const HabitTracker: React.FC = () => {
    const { data, setData, today } = useContext(DataContext);
    const todayData = data[today] || { habits: DEFAULT_HABITS.map(h => ({ ...h, completed: false })), points: 0, journal: '' };

    // FIX: Ensure habits array exists to prevent runtime errors.
    const habitsForToday = todayData.habits || DEFAULT_HABITS.map(h => ({ ...h, completed: false }));

    const toggleHabit = (id: string) => {
        // FIX: Use the safe habitsForToday array.
        const updatedHabits = habitsForToday.map(habit =>
            habit.id === id ? { ...habit, completed: !habit.completed } : habit
        );
        setData(prev => ({
            ...prev,
            [today]: { ...todayData, habits: updatedHabits },
        }));
    };

    const trackerInfo = TRACKERS.find(t => t.id === 'habits')!;
    
    // FIX: Use the safe habitsForToday array.
    const completedCount = habitsForToday.filter(h => h.completed).length;
    const totalCount = habitsForToday.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <Card className="mb-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Today's Progress</h3>
                    <span className="font-semibold text-accent-primary">{completedCount} / {totalCount}</span>
                </div>
                <div className="w-full bg-input-bg rounded-full h-2.5">
                    <div className="bg-accent-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </Card>
            
            <div className="space-y-4">
                {/* FIX: Use the safe habitsForToday array. */}
                {habitsForToday.map((habit: Habit) => (
                    <Card key={habit.id} className="flex items-center justify-between p-4 cursor-pointer hover:bg-border transition-colors" onClick={() => toggleHabit(habit.id)}>
                        <span className={`text-lg ${habit.completed ? 'line-through text-text-disabled' : ''}`}>
                            {habit.name}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${habit.completed ? 'bg-accent-primary border-accent-primary' : 'border-border'}`}>
                             {habit.completed && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                    </Card>
                ))}
            </div>
        </TrackerWrapper>
    );
};

export default HabitTracker;