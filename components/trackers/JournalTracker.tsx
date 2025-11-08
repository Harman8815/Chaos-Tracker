import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../App';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { DailyData } from '../../types';

interface JournalTrackerProps {
    todayData: DailyData;
}

const JournalTracker: React.FC<JournalTrackerProps> = ({ todayData }) => {
    const dataContext = useContext(DataContext);
    const [entry, setEntry] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setEntry(todayData.journal || '');
    }, [todayData.journal]);

    const handleSave = () => {
        const today = new Date().toISOString().split('T')[0];
        dataContext?.updateData(today, { journal: entry });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <Card>
            <h2 className="text-xl font-semibold text-light-text-primary dark:text-text-primary mb-4">Daily Journal</h2>
            <p className="text-light-text-secondary dark:text-text-secondary mb-4">Take a moment to write down your thoughts. What's on your mind?</p>
            <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Start writing here..."
                className="w-full h-64 p-4 bg-light-primary dark:bg-primary border border-light-border-color dark:border-border-color rounded-lg text-light-text-primary dark:text-text-primary focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
            />
            <div className="mt-4 flex justify-end">
                <Button onClick={handleSave} disabled={!entry.trim()}>
                    {isSaved ? 'Saved!' : 'Save Entry'}
                </Button>
            </div>
        </Card>
    );
};

export default JournalTracker;