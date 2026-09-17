"use client";

import React, { useContext, useState, useEffect } from 'react';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Smile, Meh, Frown, Angry } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { moodService, MoodEntry } from '../../services/moodService';

const moods = [
    { id: 'happy', label: 'Great', icon: Smile, color: 'text-success' },
    { id: 'neutral', label: 'Good', icon: Meh, color: 'text-accent-primary' },
    { id: 'sad', label: 'Okay', icon: Frown, color: 'text-warning' },
    { id: 'anxious', label: 'Bad', icon: Angry, color: 'text-error' },
];

const MoodTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'mood')!;
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { today } = useContext(DataContext);

    useEffect(() => {
        const fetchMood = async () => {
            try {
                setLoading(true);
                setError(null);
                const entries = await moodService.getAll();
                const todayEntry = entries.find(e => e.date === today);
                if (todayEntry) {
                    setSelectedMood(todayEntry.mood);
                }
            } catch (err) {
                setError('Failed to load mood data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMood();
    }, [today]);

    const handleMoodSelect = async (moodId: string) => {
        setSelectedMood(moodId);
        try {
            setSaving(true);
            setError(null);
            await moodService.create({
                date: today,
                mood: moodId as MoodEntry['mood'],
            });
        } catch (err) {
            setError('Failed to save mood');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <TrackerWrapper tracker={trackerInfo}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-text-secondary">Loading mood...</div>
                </div>
            </TrackerWrapper>
        );
    }

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="text-white">How are you feeling today?</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="text-error text-sm mb-4">{error}</div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {moods.map(mood => {
                            const Icon = mood.icon;
                            return (
                                <button
                                    key={mood.id}
                                    onClick={() => handleMoodSelect(mood.id)}
                                    disabled={saving}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                        selectedMood === mood.id
                                            ? 'border-accent-primary bg-accent-primary/10'
                                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Icon className={`w-8 h-8 ${mood.color}`} />
                                    <span className="text-sm font-medium text-white">{mood.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    {selectedMood && (
                        <p className="text-text-secondary text-center mt-4">
                            You selected: <span className="text-white font-medium">{moods.find(m => m.id === selectedMood)?.label}</span>
                            {saving && <span className="ml-2 text-accent-primary">Saving...</span>}
                        </p>
                    )}
                </CardContent>
            </Card>
        </TrackerWrapper>
    );
};

export default MoodTracker;
