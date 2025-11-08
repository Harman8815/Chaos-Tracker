import React, { useContext, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DataContext, SettingsContext } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import { MOOD_OPTIONS } from '../constants';
import { getDailyReflection } from '../services/geminiService';
import type { DailyData, Mood } from '../types';

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3Z"/><path d="M22 6L20.5 9L18 10L20.5 11L22 14L23.5 11L26 10L23.5 9L22 6Z"/><path d="M4 18L5.5 15L8 14L5.5 13L4 10L2.5 13L0 14L2.5 15L4 18Z"/></svg>

const moodToValue = (mood: Mood | undefined) => {
    if (!mood) return 0;
    const mapping: Record<Mood, number> = { 'awful': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'ecstatic': 5 };
    return mapping[mood];
}

const getMoodColor = (mood: Mood | undefined) => {
    if (!mood) return '#A0AEC0'; // gray
    const moodOption = MOOD_OPTIONS.find(m => m.mood === mood);
    if (moodOption) {
      const colorMap: Record<string, string> = { 'green-400': '#48BB78', 'lime-400': '#A7F3D0', 'yellow-400': '#F6E05E', 'blue-400': '#63B3ED', 'red-400': '#F56565' };
      const colorKey = moodOption.color.replace('text-', '');
      return colorMap[colorKey] || '#A0AEC0';
    }
    return '#A0AEC0';
}

const Clock: React.FC = () => {
    const settingsContext = useContext(SettingsContext);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const timeFormat = settingsContext?.settings.timeFormat === '12h';
    
    return (
        <div className="text-right">
            <p className="text-4xl font-bold text-light-text-primary dark:text-text-primary">
                {time.toLocaleTimeString([], { hour12: timeFormat, hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-text-secondary">
                {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const dataContext = useContext(DataContext);
    const [reflection, setReflection] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const todayData = dataContext?.data[today] || {};

    const handleGenerateReflection = async () => {
        setIsLoading(true);
        setReflection('');
        const result = await getDailyReflection(todayData);
        setReflection(result);
        setIsLoading(false);
    };

    const getLast7DaysData = () => {
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            const dayData = dataContext?.data[dateKey];
            result.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                moodValue: moodToValue(dayData?.mood),
                mood: dayData?.mood
            });
        }
        return result;
    }

    const moodChartData = getLast7DaysData();
    const completedHabits = todayData.habits?.filter(h => h.completed).length || 0;
    const totalHabits = todayData.habits?.length || 0;

  return (
    <div className="animate-fadeIn">
        <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-text-primary">Dashboard</h1>
            <Clock />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3">
                <h2 className="text-xl font-semibold mb-2 text-light-text-primary dark:text-text-primary">Daily Reflection</h2>
                <p className="text-light-text-secondary dark:text-text-secondary mb-4">Get an AI-powered reflection on your day's progress.</p>
                <Button onClick={handleGenerateReflection} disabled={isLoading}>
                    {isLoading ? 'Generating...' : <><SparklesIcon /> <span className="ml-2">Generate Today's Reflection</span></>}
                </Button>
                {reflection && (
                    <div className="mt-4 p-4 bg-light-primary dark:bg-primary rounded-lg border border-light-border-color dark:border-border-color">
                        <p className="text-light-text-primary dark:text-text-primary whitespace-pre-wrap">{reflection}</p>
                    </div>
                )}
            </Card>

            <Card className="lg:col-span-2">
                 <h2 className="text-xl font-semibold mb-4 text-light-text-primary dark:text-text-primary">Mood Tracker (Last 7 Days)</h2>
                 <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={moodChartData}>
                        <XAxis dataKey="name" stroke="currentColor" className="text-light-text-secondary dark:text-text-secondary" />
                        <YAxis hide={true} domain={[0, 5]} />
                        <Tooltip 
                            cursor={{fill: 'rgba(88, 101, 242, 0.1)'}}
                            contentStyle={{ backgroundColor: 'var(--color-secondary)', border: '1px solid var(--color-border)', borderRadius: '0.5rem' }}
                            labelStyle={{ color: 'var(--color-text-primary)' }}
                        />
                        <Bar dataKey="moodValue" name="Mood" barSize={30}>
                             {moodChartData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={getMoodColor(entry.mood)} />
                             ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold mb-2 text-light-text-primary dark:text-text-primary">Habits Today</h2>
                <div className="flex items-center justify-center space-x-4">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-light-border-color dark:text-border-color"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none" stroke="currentColor" strokeWidth="3"></path>
                            <path className="text-light-accent dark:text-accent"
                                  strokeDasharray={`${totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0}, 100`}
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-light-text-primary dark:text-text-primary">{completedHabits}</span>
                            <span className="text-sm text-light-text-secondary dark:text-text-secondary">/{totalHabits}</span>
                        </div>
                    </div>
                </div>
                 <p className="text-center mt-2 text-light-text-secondary dark:text-text-secondary">Completed</p>
            </Card>
        </div>
    </div>
  );
};

export default Dashboard;