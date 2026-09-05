import React, { useContext, useState, useEffect, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import { SettingsContext } from '../context/SettingsContext';
import { getAIPoweredSummary } from '../services/geminiService';
import { dashboardService } from '../services/dashboardService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Habit, AllData, DailyData } from '../types';
import { PieChart } from './charts/PieChart';
import { RadarChart } from './dashboard/RadarChart';
import { MultiLineTrendChart } from './dashboard/MultiLineTrendChart';
import { StreakHighlight } from './dashboard/StreakHighlight';
import { MonthlyAverageTable } from './dashboard/MonthlyAverageTable';
import { StreakBarChart } from './dashboard/StreakBarChart';
import { StreakStats } from './dashboard/StreakStats';
import { WeeklyPerformanceChart } from './dashboard/WeeklyPerformanceChart';
import { MarkdownView } from './dashboard/MarkdownView';
import { Loader } from './dashboard/Loader';

const NoData: React.FC = () => <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">Not enough data to display.</div>;

function calculateStreaks(data: AllData, habits: Habit[]): Record<string, number> {
    const streaks: Record<string, number> = {};
    for (const habit of habits) {
        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const dateToCheck = new Date(today);
            dateToCheck.setDate(today.getDate() - i);
            const dateString = dateToCheck.toISOString().split('T')[0];
            const dayData = data[dateString] as DailyData | undefined;
            const score = dayData?.habitScores?.[habit.id] ?? 0;
            if (score > 0) {
                currentStreak++;
            } else {
                break;
            }
        }
        streaks[habit.id] = currentStreak;
    }
    return streaks;
}

const Dashboard: React.FC = () => {
    const { data, habits, today } = useContext(DataContext);
    const { settings, t } = useContext(SettingsContext);
    const [summary, setSummary] = useState('Generating reflection...');
    const [isLoading, setIsLoading] = useState(true);
    const [serverStreaks, setServerStreaks] = useState<any[] | null>(null);
    const [todayDistributionServer, setTodayDistributionServer] = useState<any | null>(null);
    const [habitPerf7Server, setHabitPerf7Server] = useState<any[] | null>(null);
    const [time, setTime] = useState(new Date());
    const [selectedTrend, setSelectedTrend] = useState('total');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleGenerateSummary = () => {
        setIsLoading(true);
        getAIPoweredSummary(data, habits).then(res => {
            setSummary(res);
            setIsLoading(false);
        });
    };

    useEffect(handleGenerateSummary, [data, habits]);

    useEffect(() => {
        let mounted = true;

        const fetchAnalytics = async () => {
            try {
                const streaksRes = await dashboardService.getStreaks();
                if (mounted && streaksRes?.streaks) setServerStreaks(streaksRes.streaks.map((s: any) => ({ name: s.name, streak: s.current_streak })));

                const distRes = await dashboardService.getTodayDistribution();
                if (mounted && distRes?.habits) setTodayDistributionServer(distRes.habits);

                const perfRes = await dashboardService.getHabitPerformance7();
                if (mounted && perfRes?.data) setHabitPerf7Server(perfRes.data);
            } catch (e) {
                console.debug('Analytics endpoints unavailable or failed', e);
            }
        };

        fetchAnalytics();
        return () => { mounted = false };
    }, [habits]);

    const todayPieData = useMemo(() => {
        if (todayDistributionServer && Array.isArray(todayDistributionServer) && todayDistributionServer.length) {
            return todayDistributionServer.map((h: any) => ({ name: h.name, value: h.score }));
        }

        const todayScores = data[today]?.habitScores || {};
        return habits
            .map(habit => ({
                name: habit.name,
                value: todayScores[habit.id] || 0,
            }))
            .filter(d => d.value > 0);
    }, [data, today, habits, todayDistributionServer]);

    const radarData = useMemo(() => {
        const last7Days = Object.entries(data)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .slice(0, 7);

        if (last7Days.length === 0) return [];

        return habits.map(habit => {
            const totalScore = last7Days.reduce((sum, [, dayData]) => sum + ((dayData as DailyData).habitScores?.[habit.id] || 0), 0);
            return {
                axis: habit.name,
                value: totalScore / last7Days.length,
            };
        });
    }, [data, habits]);

    const trendChartData = useMemo(() => {
        return Object.entries(data)
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .slice(-30)
            .map(([date, dailyData]) => ({
                date,
                scores: (dailyData as DailyData).habitScores || {}
            }));
    }, [data]);

    const { dataForChart, habitsForChart, maxYForChart } = useMemo(() => {
        if (selectedTrend === 'total') {
            return {
                dataForChart: trendChartData.map(({ date, scores }) => ({
                    date,
                    scores: { 'total': Object.values(scores).reduce<number>((sum, score) => sum + (Number(score) || 0), 0) / (habits.length || 1) }
                })),
                habitsForChart: [{ id: 'total', name: 'Avg Daily Score', target: 0, rangeMax: 10, completed: false }],
                maxYForChart: 10
            };
        }

        const habitsToList = selectedTrend === 'all'
            ? habits
            : habits.filter(h => h.id === selectedTrend);

        return {
            dataForChart: trendChartData,
            habitsForChart: habitsToList,
            maxYForChart: 10
        };
    }, [trendChartData, selectedTrend, habits]);

    const overallProgressData = useMemo(() => {
        const currentDate = new Date(today);
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        const totalAchieved = Object.entries(data)
            .filter(([date]) => new Date(date) >= monthStart && new Date(date) <= currentDate)
            .reduce((total, [, dayData]) => {
                return total + Object.values((dayData as DailyData).habitScores || {}).reduce((sum, score) => sum + (Number(score) || 0), 0);
            }, 0);

        const totalHabitTarget = habits.reduce((acc, habit) => acc + habit.target, 0);

        return [
            { name: 'Completed', value: totalAchieved },
            { name: 'Remaining', value: Math.max(0, totalHabitTarget - totalAchieved) }
        ];
    }, [data, habits, today]);

    const habitStreaks = useMemo(() => {
        if (serverStreaks && serverStreaks.length > 0) {
            return serverStreaks.sort((a: any, b: any) => b.streak - a.streak);
        }
        const streaks = calculateStreaks(data, habits);
        return habits.map(h => ({
            name: h.name,
            streak: streaks[h.id] || 0,
        })).sort((a, b) => b.streak - a.streak);
    }, [data, habits, serverStreaks]);

    const monthlyAverages = useMemo(() => {
        const currentDate = new Date(today);
        const daysSoFar = currentDate.getDate();

        const habitTotals: Record<string, number> = {};
        habits.forEach(h => habitTotals[h.id] = 0);

        for (let i = 1; i <= daysSoFar; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0];
            const dayData = data[date] as DailyData | undefined;
            if (dayData?.habitScores) {
                for (const habit of habits) {
                    habitTotals[habit.id] += dayData.habitScores[habit.id] || 0;
                }
            }
        }
        return habits.map(habit => ({
            name: habit.name,
            avg: (habitTotals[habit.id] || 0) / daysSoFar
        }));
    }, [data, habits, today]);

    const weeklyPerformance = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const totals = new Array(7).fill(0);
        const counts = new Array(7).fill(0);

        Object.entries(data).forEach(([date, val]) => {
            const d = new Date(date);
            const dayIndex = d.getDay();
            const dailyTotal = Object.values((val as DailyData).habitScores || {}).reduce((sum, s) => sum + (Number(s) || 0), 0);
            totals[dayIndex] += dailyTotal;
            counts[dayIndex]++;
        });

        return days.map((day, i) => ({
            day,
            score: counts[i] > 0 ? totals[i] / counts[i] : 0
        }));
    }, [data]);

    const bestDay = useMemo(() => {
        if (weeklyPerformance.length === 0) return null;
        return weeklyPerformance.reduce((a, b) => a.score > b.score ? a : b);
    }, [weeklyPerformance]);

    const levelStats = useMemo(() => {
        let totalXP = 0;
        Object.values(data).forEach((day) => {
            const d = day as DailyData;
            if (d.habitScores) {
                totalXP += Object.values(d.habitScores).reduce((sum, s) => sum + (Number(s) || 0), 0);
            }
        });

        const level = Math.floor(Math.sqrt(totalXP / 10));
        const currentLevelXP = Math.pow(level, 2) * 10;
        const nextLevelXP = Math.pow(level + 1, 2) * 10;
        const progress = totalXP - currentLevelXP;
        const needed = nextLevelXP - currentLevelXP;

        let rank = "Novice Tracker";
        if (level >= 5) rank = "Consistent Achiever";
        if (level >= 10) rank = "Discipline Disciple";
        if (level >= 20) rank = "Habit Master";
        if (level >= 30) rank = "Elite Performer";
        if (level >= 50) rank = "Grandmaster";

        return { level, totalXP, progress, needed, rank };
    }, [data]);

    return (
        <div className="relative h-full overflow-y-auto pb-20">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background -z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary/15 via-transparent to-transparent -z-10" />
            <div className="p-6 lg:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight text-white">{t('dashboard')}</h1>
                        <p className="text-sm text-text-secondary">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <Card className="xl:col-span-4 border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    <StreakHighlight streaks={habitStreaks} />
                </Card>

                <Card className="xl:col-span-4 border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <h3 className="font-bold text-xl text-white">Habit Trends (30 Days)</h3>
                        <Select
                            value={selectedTrend}
                            onChange={(e) => setSelectedTrend(e.target.value)}
                        >
                            <option value="all">All Habits</option>
                            <option value="total">Avg Daily Score</option>
                            {habits.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </Select>
                    </div>
                    <MultiLineTrendChart data={dataForChart} habits={habitsForChart} maxY={maxYForChart} />
                </Card>

                <Card className="xl:col-span-2 border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="font-bold text-xl text-white mb-4">Habit Performance (7 Days)</h3>
                    <div className="w-full h-[500px]">
                        <RadarChart data={radarData} />
                    </div>
                </Card>

                 <Card className="xl:col-span-2 border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="font-bold text-xl text-white mb-4">Today's Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        <PieChart data={todayPieData} type="pie" />
                    </div>
                </Card>

                 <Card className="xl:col-span-2 flex flex-col justify-between h-full border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl text-white">Habit Streaks</h3>
                            <span className="text-xs text-text-secondary uppercase tracking-wider">Current</span>
                        </div>
                        <div className="mb-4">
                            <StreakBarChart data={habitStreaks} />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-white/10 mt-auto">
                        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Analytics</h4>
                        <StreakStats streaks={habitStreaks} />
                    </div>
                </Card>

                <Card className="xl:col-span-2 flex flex-col h-full border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <h3 className="font-bold text-xl text-white mb-4 flex-shrink-0">Monthly Daily Average</h3>
                    <div className="relative flex-grow min-h-[200px]">
                         <MonthlyAverageTable data={monthlyAverages} />
                    </div>
                </Card>

                <Card className="xl:col-span-2 flex flex-col border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    <h3 className="font-bold text-xl text-white mb-4">Weekly Performance</h3>
                    <div className="flex-grow min-h-[200px]">
                        <WeeklyPerformanceChart data={weeklyPerformance} />
                    </div>
                    {bestDay && (
                        <div className="mt-4 pt-4 border-t border-white/10 text-center">
                            <p className="text-sm text-text-secondary">Your most productive day is <span className="text-warning font-bold text-lg">{bestDay.day}</span></p>
                        </div>
                    )}
                </Card>

                <Card className="xl:col-span-2 border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                    <div className="flex flex-col h-full">
                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-white">Tracker Rank</h3>
                                <div className="px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-bold uppercase tracking-wider">
                                    {levelStats.rank}
                                </div>
                            </div>

                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-5xl font-black text-accent-primary">
                                    {levelStats.level}
                                </span>
                                <span className="text-sm text-text-secondary font-bold mb-2">LEVEL</span>
                            </div>

                            <div className="w-full h-6 bg-white/[0.06] rounded-full overflow-hidden mb-2 relative">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-primary to-accent-primary-hover transition-all duration-500 ease-out relative"
                                    style={{ width: `${(levelStats.progress / levelStats.needed) * 100}%` }}
                                >
                                </div>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                                    {Math.round((levelStats.progress / levelStats.needed) * 100)}% to Lvl {levelStats.level + 1}
                                </span>
                            </div>

                            <div className="flex justify-between text-xs text-text-secondary font-mono">
                                <span>{levelStats.progress} XP</span>
                                <span>{levelStats.needed} XP</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/[0.04] rounded-lg border border-white/10 text-center">
                                <div className="text-2xl font-bold text-white">{levelStats.totalXP.toLocaleString()}</div>
                                <div className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Lifetime XP</div>
                            </div>
                            <div className="p-4 bg-white/[0.04] rounded-lg border border-white/10 text-center">
                                <div className="text-2xl font-bold text-white">{Object.keys(data).length}</div>
                                <div className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Days Active</div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="xl:col-span-2 flex flex-col min-h-[300px] border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-white flex items-center gap-2">
                            AI Daily Reflection
                            <span className="text-xs font-normal bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full">Beta</span>
                        </h3>
                    </div>
                    <div className="text-text-secondary mb-4 flex-grow overflow-y-auto max-h-96 p-2 bg-white/[0.04] rounded-lg border border-white/10">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <MarkdownView content={summary} />
                        )}
                    </div>
                    <div className="mt-auto pt-2">
                        <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? 'Regenerating...' : 'Regenerate Reflection'}
                        </Button>
                    </div>
                </Card>

                <Card className="xl:col-span-2 border-white/5 bg-white/[0.03] animate-fade-in-up" style={{ animationDelay: '900ms' }}>
                    <div className="flex flex-col items-center justify-between h-full p-4">
                        <h3 className="font-bold text-xl text-white mb-4 w-full text-left">Monthly Target</h3>
                        <div className="w-full flex-grow flex items-center justify-center">
                            <PieChart data={overallProgressData} type="donut" />
                        </div>
                        <div className="text-center mt-4 pt-4 border-t border-white/10 w-full">
                            <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wide mb-2">Current Time</h3>
                            <p className="text-4xl font-mono font-bold text-accent-primary tracking-tight">
                                {time.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: settings.timeFormat === '12h'
                                })}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
