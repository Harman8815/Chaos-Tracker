

import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { DataContext } from '../../context/DataContext';
import { SettingsContext } from '../../context/SettingsContext';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { DailyData } from '../../types';
import { pointsService } from '../../services/pointsService';

type View = 'daily' | 'monthly' | 'yearly';

const TrajectoryChart = ({ dailyTotals, daysInMonth }: { dailyTotals: { [day: number]: number }, daysInMonth: number }) => {
    const width = daysInMonth * 64; // 4rem = 64px
    const height = 64; // h-16
    const padding = 8;

    const dataPoints = Array.from({ length: daysInMonth }, (_, i) => dailyTotals[i + 1] || 0);
    const maxTotal = Math.max(...dataPoints, 1);
    const isEmpty = dataPoints.every(p => p === 0);

    const getX = (index: number) => index * 64 + 32;
    const getY = (value: number) => height - padding - (value / maxTotal) * (height - (2 * padding));

    const linePath = dataPoints
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point)}`)
        .join(' ');

    return (
        <div className="h-16 border-b-2 border-[rgba(139,92,246,0.35)]" style={{ width: `${width}px` }}>
            {!isEmpty && (
                <svg viewBox={`0 0 ${width} ${height}`} className="h-16 border-b-2 border-[rgba(139,92,246,0.35)]" style={{ minWidth: `${width}px` }}>
                    <path d={linePath} strokeWidth="2.5" fill="none" className="stroke-current text-accent-primary" />
                    {dataPoints.map((point, index) => (
                        <g key={index}>
                            <title>{`Day ${index + 1}: ${point}`}</title>
                            <circle
                                cx={getX(index)}
                                cy={getY(point)}
                                r="3"
                                className="fill-current text-accent-primary-dark stroke-background"
                                strokeWidth="2"
                            />
                        </g>
                    ))}
                </svg>
            )}
        </div>
    );
};


const PointsTracker: React.FC = () => {
    const { data, setData, today, habits, setHabits } = useContext(DataContext);
    const { setIsEditHabitsModalOpen, setIsEditRulesModalOpen, scoringRules, setScoringRules } = useContext(SettingsContext);
    const [view, setView] = useState<View>('daily');
    const [isEditable, setIsEditable] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date(today));

    const gridBodyRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (gridBodyRef.current && chartRef.current) {
            chartRef.current.scrollLeft = gridBodyRef.current.scrollLeft;
        }
    };

    useEffect(() => {
        const gridBody = gridBodyRef.current;
        if (gridBody) {
            gridBody.addEventListener('scroll', handleScroll);
            return () => gridBody.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [habitsData, rulesData] = await Promise.all([
                    pointsService.getHabits(),
                    pointsService.getRules(),
                ]);
                setHabits(habitsData);
                setScoringRules(rulesData);
            } catch (error) {
                console.error("Error fetching initial points data:", error);
                // Optionally, show an error message to the user
            }
        };

        fetchInitialData();
    }, [setHabits, setScoringRules]);

    useEffect(() => {
        const fetchScores = async () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const startDate = new Date(year, month, 1).toISOString().split('T')[0];
            const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

            try {
                const scores = await pointsService.getScores(startDate, endDate);
                setData(prev => {
                    const newData = { ...prev };
                    scores.forEach(score => {
                        const date = score.date;
                        if (!newData[date]) {
                            newData[date] = { journal: '', habitScores: {} };
                        }
                        // FIX: Explicitly type dayData to resolve type inference issues.
                        const dayData: DailyData = newData[date];
                        const updatedHabitScores = { ...dayData.habitScores, [score.habit_id]: score.score };

                        newData[date] = { ...dayData, habitScores: updatedHabitScores };
                    });
                    return newData;
                });
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        };

        if (habits.length > 0) {
            fetchScores();
        }
    }, [currentDate, habits, setData]);

    const daysInMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(), [currentDate]);

    const handleMonthChange = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const handleScoreClick = (date: string, habitId: string) => {
        if (!isEditable) return;

        const originalState = { ...data };

        // Calculate newScore BEFORE setData to ensure correct value is sent to API
        const dayData: DailyData = data[date] || { journal: '', habitScores: {} };
        const currentScore = dayData.habitScores?.[habitId] || 0;
        const habit = habits.find(h => h.id === habitId);
        const rangeMax = habit?.rangeMax ?? 10;
        const newScore = (currentScore + 1) % (rangeMax + 1);

        setData(prev => {
            const dayData: DailyData = prev[date] || { journal: '', habitScores: {} };
            const updatedHabitScores = { ...dayData.habitScores, [habitId]: newScore };

            return {
                ...prev,
                [date]: { ...dayData, habitScores: updatedHabitScores },
            };
        });

        pointsService.updateScore(date, habitId, newScore)
            .catch(error => {
                console.error("Error updating score:", error);
                // Revert to original state on error
                setData(originalState);
                // Optionally, show a notification to the user
            });
    };


    const handleTargetChange = (habitId: string, newTarget: number) => {
        const originalHabits = [...habits];
        setHabits(prev => prev.map(h => h.id === habitId ? { ...h, target: newTarget } : h));

        const habitToUpdate = habits.find(h => h.id === habitId);
        if (habitToUpdate) {
            const { completed, id, ...rest } = habitToUpdate;
            pointsService.updateHabit(habitId, { ...rest, target: newTarget })
                .catch(error => {
                    console.error("Error updating habit target:", error);
                    setHabits(originalHabits);
                    // Optionally, show a notification to the user
                });
        }
    };

    const getMonthData = (month: number, year: number) => {
        return Object.entries(data).filter(([date]) => {
            const d = new Date(date);
            return d.getFullYear() === year && d.getMonth() === month;
        });
    };

    const monthlyTotals = useMemo(() => {
        const totals: { [habitId: string]: number } = {};
        habits.forEach(h => totals[h.id] = 0);

        const monthData = getMonthData(currentDate.getMonth(), currentDate.getFullYear());
        // FIX: Explicitly type the dayData parameter to resolve 'unknown' type from Object.entries.
        monthData.forEach(([, dayData]) => {
            const currentDayData = dayData as DailyData;
            if (currentDayData.habitScores) {
                for (const habitId in currentDayData.habitScores) {
                    totals[habitId] = (totals[habitId] || 0) + (currentDayData.habitScores[habitId] || 0);
                }
            }
        });
        return totals;
    }, [data, currentDate, habits]);

    const dailyTotals = useMemo(() => {
        const totals: { [day: number]: number } = {};
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0];
            // FIX: Explicitly cast dayData to resolve type inference issues.
            const dayData = data[date] as DailyData | undefined;
            if (dayData && dayData.habitScores) {
                // FIX: Ensure score is treated as a number in reduce.
                totals[i] = Object.values(dayData.habitScores).reduce((sum, score) => sum + (Number(score) || 0), 0);
            } else {
                totals[i] = 0;
            }
        }
        return totals;
    }, [data, currentDate, daysInMonth]);

    const yearlyTotals = useMemo(() => {
        const totals: { [habitId: string]: number } = {};
        habits.forEach(h => totals[h.id] = 0);

        const yearData = Object.entries(data).filter(([date]) => new Date(date).getFullYear() === currentDate.getFullYear());
        // FIX: Explicitly type the dayData parameter to resolve 'unknown' type from Object.entries.
        yearData.forEach(([, dayData]) => {
            const currentDayData = dayData as DailyData;
            if (currentDayData.habitScores) {
                for (const habitId in currentDayData.habitScores) {
                    totals[habitId] = (totals[habitId] || 0) + (currentDayData.habitScores[habitId] || 0);
                }
            }
        });
        return totals;
    }, [data, currentDate.getFullYear(), habits]);

    const getColor = (value: number, max: number) => {
        if (value === 0 || max === 0) return 'transparent';
        const percentage = (value / max) * 100;
        const hue = 200 + (percentage * -1.5); // Blue (200) to Yellow (50)
        return `hsl(${hue}, 80%, 50%)`;
    };

    const getTextColor = (bgColor: string) => {
        if (bgColor === 'transparent') return 'var(--color-text-primary)';
        const color = bgColor.substring(bgColor.indexOf('(') + 1, bgColor.lastIndexOf(')')).split(',');
        const l = parseFloat(color[2]);
        return l > 55 ? 'black' : 'white';
    };

    const trackerInfo = TRACKERS.find(t => t.id === 'points')!;

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex items-center bg-white/[0.06] p-1 rounded-lg border border-white/10">
                    {(['daily', 'monthly', 'yearly'] as View[]).map(v => (
                        <button key={v} onClick={() => setView(v)} className={`px-4 py-1.5 text-sm rounded-md capitalize transition-all ${view === v ? 'bg-accent-primary text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]' : 'text-[#e9d5ff] hover:text-white hover:bg-white/[0.08]'}`}>
                            {v}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => handleMonthChange(-1)} className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white flex items-center justify-center transition-all">&lt;</button>
                    <span className="font-semibold text-white w-40 text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => handleMonthChange(1)} className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white flex items-center justify-center transition-all">&gt;</button>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={() => setIsEditHabitsModalOpen(true)}>Manage Habits</Button>
                    <div className="flex items-center gap-2">
                        <span className="text-[#e9d5ff] text-sm">Edit</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/[0.06] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            {view === 'daily' && (
                <div>
                    <div ref={chartRef} className="overflow-hidden">
                        <TrajectoryChart dailyTotals={dailyTotals} daysInMonth={daysInMonth} />
                    </div>
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-sticky" style={{ gridTemplateColumns: `12rem repeat(${daysInMonth}, 4rem) 6rem 6rem` }}>
                            <div className="col-start-1 sticky top-0 left-0 font-bold p-2 bg-white/[0.04] z-30 text-white">Habit</div>
                            {Array.from({ length: daysInMonth }, (_, i) => (
                                <div key={i} className="sticky top-0 font-bold text-center p-2 bg-white/[0.04] z-10 text-[#e9d5ff]">{i + 1}</div>
                            ))}
                            <div className="sticky top-0 right-12 font-bold p-2 bg-white/[0.04] z-30 text-white">Total</div>
                            <div className="sticky top-0 right-0 font-bold p-2 bg-white/[0.04] z-30 text-white">Target</div>

                            <div ref={gridBodyRef} className="col-start-1 col-span-full grid grid-cols-sticky" style={{ gridTemplateColumns: `12rem repeat(${daysInMonth}, 4rem) 6rem 6rem` }}>
                                {habits.map(habit => (
                                    <React.Fragment key={habit.id}>
                                        <div className="sticky left-0 font-semibold p-2 bg-white/[0.06] flex items-center z-20 text-white">{habit.name}</div>
                                        {Array.from({ length: daysInMonth }, (_, i) => {
                                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1).toISOString().split('T')[0];
                                            const score = data[date]?.habitScores?.[habit.id] || 0;
                                            const bgColor = getColor(score, habit.rangeMax ?? 10);
                                            const textColor = getTextColor(bgColor);
                                            return (
                                                <div key={i} onClick={() => handleScoreClick(date, habit.id)} className={`flex items-center justify-center p-2 text-center border-b border-r border-white/5 ${isEditable ? 'cursor-pointer' : ''}`} style={{ backgroundColor: bgColor, color: textColor }}>
                                                    {score}
                                                </div>
                                            );
                                        })}
                                        <div className="sticky right-12 p-2 bg-white/[0.06] flex items-center justify-center font-bold z-20 text-white">{monthlyTotals[habit.id]}</div>
                                        <input type="number" value={habit.target} onChange={(e) => handleTargetChange(habit.id, parseInt(e.target.value))} className="sticky right-0 p-2 bg-white/[0.06] text-center w-full h-full border-none focus:outline-none focus:ring-2 focus:ring-accent-primary z-20 text-white" />
                                    </React.Fragment>
                                ))}
                                <div className="sticky left-0 font-bold p-2 bg-white/[0.04] z-20 text-white">Daily Total</div>
                                {Array.from({ length: daysInMonth }, (_, i) => (
                                    <div key={i} className="font-bold text-center p-2 bg-white/[0.04] border-r border-white/5 text-[#e9d5ff]">{dailyTotals[i + 1]}</div>
                                ))}
                                <div className="sticky right-12 p-2 bg-white/[0.04] z-20"></div>
                                <div className="sticky right-0 p-2 bg-white/[0.04] z-20"></div>
                            </div>
                        </div>
                    </div>
                    <Card className="mt-6 border-white/5 bg-white/[0.03]">
                        <h3 className="font-bold text-lg text-white mb-4">Monthly Progress</h3>
                        <div className="space-y-4">
                            {habits.map(habit => {
                                const progress = habit.target > 0 ? (monthlyTotals[habit.id] / habit.target) * 100 : 0;
                                return (
                                    <div key={habit.id}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-white">{habit.name}</span>
                                            <span className="text-sm font-semibold text-[#e9d5ff]">{monthlyTotals[habit.id]} / {habit.target}</span>
                                        </div>
                                        <div className="w-full bg-white/[0.06] rounded-full h-2.5">
                                            <div className="bg-accent-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                </div>
            )}
            {view === 'monthly' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-white/5 bg-white/[0.03]">
                        <h3 className="font-bold text-lg text-white mb-4">Monthly Progress Summary</h3>
                        <div className="space-y-4">
                            {habits.map(habit => {
                                const progress = habit.target > 0 ? (monthlyTotals[habit.id] / habit.target) * 100 : 0;
                                return (
                                    <div key={habit.id}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-white">{habit.name}</span>
                                            <span className="text-sm font-semibold text-[#e9d5ff]">{monthlyTotals[habit.id]} / {habit.target}</span>
                                        </div>
                                        <div className="w-full bg-white/[0.06] rounded-full h-2.5">
                                            <div className="bg-accent-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                    <Card className="border-white/5 bg-white/[0.03]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-white">Scoring Rules</h3>
                            <button onClick={() => setIsEditRulesModalOpen(true)} className="text-sm text-accent-primary hover:underline">Edit</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/[0.04]">
                                    <tr>
                                        <th className="p-2 text-[#e9d5ff]">Activity</th>
                                        <th className="p-2 text-[#e9d5ff]">Max Points</th>
                                        <th className="p-2 text-[#e9d5ff]">Penalty Rule</th>
                                        <th className="p-2 text-[#e9d5ff]">0 Points Condition</th>
                                        <th className="p-2 text-[#e9d5ff]">Scoring Logic / Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scoringRules.map((rule) => (
                                        <tr key={rule.id} className="border-b border-white/5">
                                            <td className="p-2 font-semibold text-white">{rule.activity}</td>
                                            <td className="p-2 text-[#e9d5ff]">{rule.maxPoints}</td>
                                            <td className="p-2 text-[#e9d5ff]">{rule.penaltyRule}</td>
                                            <td className="p-2 text-[#e9d5ff]">{rule.zeroPointsCondition}</td>
                                            <td className="p-2 text-[#e9d5ff]">{rule.scoringLogic}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
            {view === 'yearly' && (
                <Card className="border-white/5 bg-white/[0.03]">
                    <h3 className="font-bold text-lg text-white mb-4">Yearly Summary for {currentDate.getFullYear()}</h3>
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.04]">
                            <tr>
                                <th className="p-2 text-[#e9d5ff]">Habit</th>
                                <th className="p-2 text-[#e9d5ff]">Total Score</th>
                                <th className="p-2 text-[#e9d5ff]">Yearly Target</th>
                                <th className="p-2 text-[#e9d5ff]">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map(habit => {
                                const yearlyTarget = habit.target * 12;
                                const progress = yearlyTarget > 0 ? (yearlyTotals[habit.id] / yearlyTarget) * 100 : 0;
                                return (
                                    <tr key={habit.id} className="border-b border-white/5">
                                        <td className="p-2 font-semibold text-white">{habit.name}</td>
                                        <td className="p-2 text-[#e9d5ff]">{yearlyTotals[habit.id]}</td>
                                        <td className="p-2 text-[#e9d5ff]">{yearlyTarget}</td>
                                        <td className="p-2">
                                            <div className="w-full bg-white/[0.06] rounded-full h-4">
                                                <div className="bg-accent-primary h-4 rounded-full text-xs text-white text-center flex items-center justify-center transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}>
                                                    {progress.toFixed(1)}%
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Card>
            )}
        </TrackerWrapper>
    );
};

export default PointsTracker;
