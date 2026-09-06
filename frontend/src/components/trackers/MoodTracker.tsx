"use client";

import React, { useContext, useState } from 'react';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Smile, Meh, Frown, Angry } from 'lucide-react';

const moods = [
    { id: 'great', label: 'Great', icon: Smile, color: 'text-success' },
    { id: 'good', label: 'Good', icon: Meh, color: 'text-accent-primary' },
    { id: 'okay', label: 'Okay', icon: Frown, color: 'text-warning' },
    { id: 'bad', label: 'Bad', icon: Angry, color: 'text-error' },
];

const MoodTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'mood')!;
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="text-white">How are you feeling today?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {moods.map(mood => {
                            const Icon = mood.icon;
                            return (
                                <button
                                    key={mood.id}
                                    onClick={() => setSelectedMood(mood.id)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                        selectedMood === mood.id
                                            ? 'border-accent-primary bg-accent-primary/10'
                                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                                    }`}
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
                        </p>
                    )}
                </CardContent>
            </Card>
        </TrackerWrapper>
    );
};

export default MoodTracker;

