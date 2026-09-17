"use client";

import React, { useContext, useState, useEffect } from 'react';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Minus } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { waterService, WaterEntry } from '../../services/waterService';

const WaterTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'water')!;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [entry, setEntry] = useState<WaterEntry | null>(null);
    const { today } = useContext(DataContext);

    const glasses = entry?.glasses ?? 0;
    const target = entry?.target ?? 8;

    useEffect(() => {
        const fetchWater = async () => {
            try {
                setLoading(true);
                setError(null);
                const entries = await waterService.getAll();
                const todayEntry = entries.find(e => e.date === today);
                if (todayEntry) {
                    setEntry(todayEntry);
                } else {
                    setEntry(null);
                }
            } catch (err) {
                setError('Failed to load water data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWater();
    }, [today]);

    const saveEntry = async (glasses: number, target: number) => {
        try {
            setSaving(true);
            setError(null);
            if (entry) {
                const updated = await waterService.update(entry.id, { glasses, target });
                setEntry(updated);
            } else {
                const created = await waterService.create({ date: today, glasses, target });
                setEntry(created);
            }
        } catch (err) {
            setError('Failed to save water intake');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const addGlass = () => {
        const newGlasses = Math.min(glasses + 1, target);
        setEntry(prev => prev ? { ...prev, glasses: newGlasses } : null);
        saveEntry(newGlasses, target);
    };

    const removeGlass = () => {
        const newGlasses = Math.max(glasses - 1, 0);
        setEntry(prev => prev ? { ...prev, glasses: newGlasses } : null);
        saveEntry(newGlasses, target);
    };

    if (loading) {
        return (
            <TrackerWrapper tracker={trackerInfo}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-text-secondary">Loading water intake...</div>
                </div>
            </TrackerWrapper>
        );
    }

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="text-white">Water Intake</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="text-error text-sm mb-4">{error}</div>
                    )}
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-32 h-32">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-white/[0.06]"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={2 * Math.PI * 56}
                                    strokeDashoffset={2 * Math.PI * 56 * (1 - glasses / target)}
                                    className="text-accent-primary transition-all duration-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">{glasses}</span>
                            </div>
                        </div>
                        <div className="text-text-secondary text-sm">
                            {glasses} / {target} glasses
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                onClick={removeGlass} 
                                variant="outline" 
                                size="icon"
                                disabled={glasses === 0 || saving}
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <Button 
                                onClick={addGlass} 
                                size="icon"
                                disabled={glasses >= target || saving}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TrackerWrapper>
    );
};

export default WaterTracker;
