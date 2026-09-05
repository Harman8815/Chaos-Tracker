"use client";

import React, { useContext, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import { SettingsContext } from '../../context/SettingsContext';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Plus } from 'lucide-react';

const HabitTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'habits')!;
    const { habits, setHabits } = useContext(DataContext);
    const { today } = useContext(DataContext);
    const [newHabit, setNewHabit] = useState('');

    const handleToggle = (id: string) => {
        setHabits(prev => prev.map(h => 
            h.id === id ? { ...h, completed: !h.completed } : h
        ));
    };

    const handleAdd = () => {
        if (!newHabit.trim()) return;
        setHabits(prev => [...prev, {
            id: Date.now().toString(),
            name: newHabit.trim(),
            completed: false,
            target: 1,
            rangeMax: 10,
            createdAt: new Date().toISOString()
        }]);
        setNewHabit('');
    };

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <Card className="border-white/5 bg-white/[0.03]">
                <CardHeader>
                    <CardTitle className="text-white">Today's Habits</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {habits.map(habit => (
                            <div 
                                key={habit.id} 
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                    habit.completed 
                                        ? 'border-success/30 bg-success/5' 
                                        : 'border-white/10 bg-white/[0.02]'
                                }`}
                            >
                                <button
                                    onClick={() => handleToggle(habit.id)}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                        habit.completed 
                                            ? 'bg-success border-success' 
                                            : 'border-white/20 hover:border-accent-primary'
                                    }`}
                                >
                                    {habit.completed && <Check className="text-white w-3 h-3" />}
                                </button>
                                <span className={`flex-1 ${habit.completed ? 'line-through text-text-tertiary' : 'text-white'}`}>
                                    {habit.name}
                                </span>
                            </div>
                        ))}
                        {habits.length === 0 && (
                            <p className="text-text-secondary text-center py-8">No habits yet. Add your first habit below.</p>
                        )}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <input
                            type="text"
                            value={newHabit}
                            onChange={e => setNewHabit(e.target.value)}
                            placeholder="Add a new habit..."
                            className="flex-1 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        />
                        <Button onClick={handleAdd} size="icon">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TrackerWrapper>
    );
};

export default HabitTracker;
