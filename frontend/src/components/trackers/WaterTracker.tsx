"use client";

import React, { useContext, useState } from 'react';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Minus } from 'lucide-react';

const WaterTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'water')!;
    const [glasses, setGlasses] = useState(0);
    const target = 8;

    const addGlass = () => setGlasses(prev => Math.min(prev + 1, target));
    const removeGlass = () => setGlasses(prev => Math.max(prev - 1, 0));

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="text-white">Water Intake</CardTitle>
                </CardHeader>
                <CardContent>
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
                                disabled={glasses === 0}
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <Button 
                                onClick={addGlass} 
                                size="icon"
                                disabled={glasses >= target}
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

