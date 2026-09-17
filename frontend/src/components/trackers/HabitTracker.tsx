"use client";

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../context/DataContext';
import { SettingsContext } from '../../context/SettingsContext';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Plus } from 'lucide-react';
import { pointsService } from '../../services/pointsService';

const HabitTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'habits')!;
    const { habits, setHabits } = useContext(DataContext);
    const { today } = useContext(DataContext);
    const [newHabit, setNewHabit] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                setLoading(true);
                const data = await pointsService.getHabits();
                setHabits(data);
            } catch (err) {
                console.error('Failed to load habits:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHabits();
    }, [setHabits]);

    const handleToggle = async (id: string) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;
        
        setSaving(true);
        try {
            const updated = await pointsService.updateHabit(id, {
                ...habit,
                completed: !habit.completed,
            });
            setHabits(prev => prev.map(h => h.id === id ? updated : h));
        } catch (err) {
            console.error('Failed to update habit:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleAdd = async () => {
        if (!newHabit.trim()) return;
        setSaving(true);
        try {
            const created = await pointsService.createHabit({
                name: newHabit.trim(),
                target: 1,
                rangeMax: 10,
            });
            setHabits(prev => [...prev, created]);
            setNewHabit('');
        } catch (err) {
            console.error('Failed to add habit:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <TrackerWrapper tracker={trackerInfo}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-text-secondary">Loading habits...</div>
                </div>
            </TrackerWrapper>
        );
    }

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <Card className="glass">
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
                                    disabled={saving}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                        habit.completed 
                                            ? 'bg-success border-success' 
                                            : 'border-white/20 hover:border-accent-primary'
                                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        <Button 
                            onClick={handleAdd} 
                            disabled={saving || !newHabit.trim()}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TrackerWrapper>
    );
};

export default HabitTracker;

