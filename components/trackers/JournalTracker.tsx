import React, { useState, useContext } from 'react';
// FIX: Corrected import paths for context and constants.
import { DataContext } from '../../App';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';

const getToday = () => new Date().toISOString().split('T')[0];

const JournalTracker: React.FC = () => {
    const today = getToday();
    const { data, setData } = useContext(DataContext);
    
    const todayData = data[today] || { habits: [], journal: '', points: 0 };
    const [text, setText] = useState(todayData.journal);
    const [feedback, setFeedback] = useState('');

    const handleSave = () => {
        setData(prev => ({ ...prev, [today]: { ...todayData, journal: text } }));
        setFeedback('Saved successfully!');
        setTimeout(() => setFeedback(''), 2000);
    };
    
    const trackerInfo = TRACKERS.find(t => t.id === 'journal')!;
    
    const pastEntries = Object.entries(data)
        .filter(([date, entryData]) => date !== today && entryData.journal)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .slice(0, 5);

    return (
        <TrackerWrapper tracker={trackerInfo}>
             <Card>
                <h3 className="font-bold text-lg mb-4">Today's Entry</h3>
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={12}
                    className="w-full p-3 rounded-md bg-input-bg border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    placeholder="What's on your mind?"
                />
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-green-500 h-5">{feedback}</span>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </Card>

            <div className="mt-8">
                <h4 className="font-bold text-lg mb-4">Past Entries</h4>
                <div className="space-y-4">
                    {pastEntries.length > 0 ? (
                        pastEntries.map(([date, entryData]) => (
                            <Card key={date}>
                                <strong className="block mb-2">{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                <p className="text-text-secondary">{entryData.journal.substring(0, 150)}...</p>
                            </Card>
                        ))
                    ) : (
                        <p className="text-text-secondary">No past entries found.</p>
                    )}
                </div>
            </div>
        </TrackerWrapper>
    );
};

export default JournalTracker;