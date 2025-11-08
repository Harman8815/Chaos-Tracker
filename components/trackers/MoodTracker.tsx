import React, { useContext } from 'react';
import { DataContext } from '../../App';
import Card from '../ui/Card';
import type { DailyData, Mood } from '../../types';
import { MOOD_OPTIONS } from '../../constants';

interface MoodTrackerProps {
    todayData: DailyData;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ todayData }) => {
    const dataContext = useContext(DataContext);
    const selectedMood = todayData.mood;

    const selectMood = (mood: Mood) => {
        const today = new Date().toISOString().split('T')[0];
        dataContext?.updateData(today, { mood });
    };

    return (
        <Card>
            <h2 className="text-xl font-semibold text-light-text-primary dark:text-text-primary mb-2 text-center">How are you feeling today?</h2>
            <p className="text-light-text-secondary dark:text-text-secondary mb-6 text-center">Select one of the options below.</p>
            <div className="flex justify-around items-center">
                {MOOD_OPTIONS.map(({ mood, emoji, color }) => (
                    <div key={mood} className="flex flex-col items-center">
                        <button
                            onClick={() => selectMood(mood)}
                            className={`text-5xl p-4 rounded-full transition-transform duration-200 transform hover:scale-125 ${
                                selectedMood === mood ? 'bg-accent/10 dark:bg-accent/20 scale-125' : ''
                            }`}
                        >
                            {emoji}
                        </button>
                         <span className={`mt-2 font-medium capitalize text-sm ${selectedMood === mood ? color : 'text-light-text-secondary dark:text-text-secondary'}`}>{mood}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default MoodTracker;