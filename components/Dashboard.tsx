

import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { DataContext, SettingsContext } from '../App';
import { getAIPoweredSummary } from '../services/geminiService';
import Card from './ui/Card';
import Button from './ui/Button';
import { Habit, AllData } from '../types';

const CHART_COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#d946ef'];

const NoData: React.FC = () => <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">Not enough data to display.</div>;

const PieChart: React.FC<{ data: { name: string; value: number }[], type: 'pie' | 'donut' }> = ({ data, type }) => {
    const [hoveredSlice, setHoveredSlice] = useState<{ name: string; value: number } | null>(null);

    if (!data || data.length === 0 || data.every(d => d.value === 0)) return <NoData />;

    const size = 200;
    const radius = size / 2;
    const innerRadius = type === 'donut' ? radius * 0.6 : 0;
    const total = data.reduce((sum, d) => sum + d.value, 0);

    let startAngle = -90;

    const getCoordinatesForPercent = (percent: number) => [
        radius + radius * Math.cos(2 * Math.PI * percent),
        radius + radius * Math.sin(2 * Math.PI * percent),
    ];

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {data.map((slice, i) => {
                        const endAngle = startAngle + (slice.value / total) * 360;
                        const start = getCoordinatesForPercent(startAngle / 360);
                        const end = getCoordinatesForPercent(endAngle / 360);
                        const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;

                        const pathData = [
                            `M ${radius + innerRadius * Math.cos(endAngle * Math.PI / 180)} ${radius + innerRadius * Math.sin(endAngle * Math.PI / 180)}`,
                            `L ${end[0]} ${end[1]}`,
                            `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${start[0]} ${start[1]}`,
                            `L ${radius + innerRadius * Math.cos(startAngle * Math.PI / 180)} ${radius + innerRadius * Math.sin(startAngle * Math.PI / 180)}`,
                            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${radius + innerRadius * Math.cos(endAngle * Math.PI / 180)} ${radius + innerRadius * Math.sin(endAngle * Math.PI / 180)}`,
                            `Z`
                        ].join(' ');
                        
                        startAngle = endAngle;

                        return (
                            <path 
                                key={slice.name} 
                                d={pathData} 
                                fill={CHART_COLORS[i % CHART_COLORS.length]} 
                                onMouseEnter={() => setHoveredSlice(slice)}
                                onMouseLeave={() => setHoveredSlice(null)}
                                style={{
                                    transition: 'transform 0.2s ease-in-out',
                                    transform: hoveredSlice?.name === slice.name ? 'scale(1.05)' : 'scale(1)',
                                    transformOrigin: 'center center',
                                    cursor: 'pointer'
                                }}
                            />
                        );
                    })}
                </svg>
                 {(hoveredSlice || type === 'donut') && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-card-bg/80 backdrop-blur-sm border border-border rounded-md shadow-lg pointer-events-none text-center">
                        {hoveredSlice ? (
                            <>
                                <div className="font-bold text-sm">{hoveredSlice.name}</div>
                                <div className="text-xs">{hoveredSlice.value.toFixed(1)} points</div>
                                <div className="text-xs text-text-secondary">({((hoveredSlice.value / total) * 100).toFixed(0)}%)</div>
                            </>
                        ) : type === 'donut' ? (
                             <>
                                <div className="font-bold text-lg">{total > 0 ? ((data[0].value / total) * 100).toFixed(0) : 0}%</div>
                                <div className="text-xs">Complete</div>
                            </>
                        ) : null}
                    </div>
                )}
            </div>
             <div className="flex flex-col space-y-1">
                {data.map((slice, i) => (
                    <div key={slice.name} className="flex items-center text-sm">
                        <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span>{slice.name} ({total > 0 ? ((slice.value / total) * 100).toFixed(0) : 0}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RadarChart: React.FC<{ data: { axis: string; value: number }[] }> = ({ data }) => {
    const [hoveredPoint, setHoveredPoint] = useState<{ axis: string, value: number, x: number, y: number } | null>(null);

    if (!data || data.length < 3) return <NoData />;

    const size = 350;
    const center = size / 2;
    const radius = size * 0.4;
    const levels = 5;
    const maxValue = 10;
    const angleSlice = (Math.PI * 2) / data.length;

    const getPoint = (angle: number, value: number) => ({
        x: center + (radius * value / maxValue) * Math.cos(angle - Math.PI / 2),
        y: center + (radius * value / maxValue) * Math.sin(angle - Math.PI / 2),
    });

    const pointsToString = (points: {x: number, y: number}[]) => points.map(p => `${p.x},${p.y}`).join(' ');
    
    const dataPoints = data.map((d, i) => getPoint(angleSlice * i, d.value));

    return (
        <div className="relative">
             <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
                {/* Grid */}
                {[...Array(levels)].map((_, levelIndex) => (
                    <polygon
                        key={levelIndex}
                        points={pointsToString(data.map((_, i) => getPoint(angleSlice * i, maxValue * (levels - levelIndex) / levels)))}
                        className="stroke-border fill-transparent"
                    />
                ))}
                {/* Axes */}
                {data.map((_, i) => {
                    const p = getPoint(angleSlice * i, maxValue);
                    return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} className="stroke-border" />;
                })}
                 {/* Labels */}
                {data.map((d, i) => {
                    const p = getPoint(angleSlice * i, maxValue * 1.1);
                    const angleDeg = (angleSlice * i * 180 / Math.PI) - 90;
                    let textAnchor: "middle" | "start" | "end" = "middle";
                    if (angleDeg > 5 && angleDeg < 175) textAnchor = "start";
                    if (angleDeg < -5 && angleDeg > -175) textAnchor = "end";

                    return <text key={i} x={p.x} y={p.y} textAnchor={textAnchor as any} dy="0.3em" className="text-xs fill-text-secondary">{d.axis}</text>;
                })}
                {/* Data Polygon */}
                <polygon points={pointsToString(dataPoints)} className="fill-accent-primary/40 stroke-accent-primary" strokeWidth="2" />
                 {/* Data points for hover */}
                {dataPoints.map((p, i) => (
                    <circle
                        key={`hover-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r="10"
                        className="fill-transparent cursor-pointer"
                        onMouseEnter={() => setHoveredPoint({ ...data[i], x: p.x, y: p.y })}
                        onMouseLeave={() => setHoveredPoint(null)}
                    />
                ))}
            </svg>
            {hoveredPoint && (
                <div 
                    className="absolute p-2 bg-card-bg/80 backdrop-blur-sm border border-border rounded-md shadow-lg text-xs pointer-events-none"
                    style={{ left: `${hoveredPoint.x + 10}px`, top: `${hoveredPoint.y}px`, transform: 'translateY(-50%)' }}
                >
                    <div className="font-bold">{hoveredPoint.axis}</div>
                    <div>Avg: {hoveredPoint.value.toFixed(2)}</div>
                </div>
            )}
        </div>
    )
}

const MultiLineTrendChart: React.FC<{ data: { date: string, scores: { [habitId: string]: number } }[], habits: Habit[], maxY: number }> = ({ data, habits, maxY }) => {
    const [tooltip, setTooltip] = useState<{ index: number, x: number, date: string, scores: any[] } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    
    if (!data || data.length === 0) return <NoData />;

    const width = 800;
    const height = 300;
    const padding = 40;
    const maxX = data.length - 1;

    const getX = (val: number) => padding + (val / maxX) * (width - 2 * padding);
    const getY = (val: number) => height - padding - (val / maxY) * (height - 2 * padding);

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current || data.length <= 1) return;
        const svg = svgRef.current;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        
        const invertedPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
        const mouseX = invertedPoint.x;
        
        const index = Math.round(((mouseX - padding) / (width - 2 * padding)) * maxX);

        if (index < 0 || index > maxX) {
            if (tooltip) setTooltip(null);
            return;
        }

        const pointData = data[index];
        if (!pointData) return;
        
        const habitColors: {[key: string]: string} = {};
        habits.forEach((h, i) => {
            habitColors[h.id] = CHART_COLORS[i % CHART_COLORS.length];
        })

        setTooltip({
            index,
            x: getX(index),
            date: pointData.date,
            scores: habits.map(h => ({
                name: h.name,
                value: pointData.scores[h.id] || 0,
                color: habitColors[h.id]
            }))
        });
    };

    const handleMouseLeave = () => setTooltip(null);

    return (
        <div className="flex flex-col md:flex-row gap-4 relative">
             <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="w-full h-auto cursor-crosshair">
                {/* Axes and Grid */}
                {Array.from({ length: 6 }, (_, i) => i * (maxY/5)).map(val => (
                    <g key={val}>
                        <text x={padding - 10} y={getY(val)} dy="0.3em" textAnchor="end" className="text-xs fill-current text-text-secondary">{val.toFixed(0)}</text>
                        <line x1={padding} x2={width-padding} y1={getY(val)} y2={getY(val)} className="stroke-current text-text-disabled opacity-20" />
                    </g>
                ))}
                {data.map((d, i) => ( i % 5 === 0 &&
                    <text key={i} x={getX(i)} y={height - padding + 15} textAnchor="middle" className="text-xs fill-current text-text-secondary">
                        {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </text>
                ))}

                {/* Lines */}
                {habits.map((habit, habitIndex) => {
                     const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.scores[habit.id] || 0)}`).join(' ');
                     return <path key={habit.id} d={linePath} strokeWidth="2" fill="none" stroke={CHART_COLORS[habitIndex % CHART_COLORS.length]} />;
                })}
                {/* Tooltip elements */}
                {tooltip && (
                    <g className="pointer-events-none">
                        <line y1={padding} y2={height - padding} x1={tooltip.x} x2={tooltip.x} className="stroke-accent-primary" strokeDasharray="4" />
                        {tooltip.scores.map((score, i) => (
                             <circle key={i} cx={tooltip.x} cy={getY(score.value)} r="4" fill={score.color} className="stroke-background" strokeWidth="2" />
                        ))}
                    </g>
                )}
            </svg>
            {tooltip && (
                 <div className="absolute p-2 bg-card-bg/80 backdrop-blur-sm border border-border rounded-md shadow-lg text-xs pointer-events-none z-10" 
                    style={{ 
                        top: `10px`, 
                        left: `${(tooltip.x / width) * 100}%`,
                        transform: tooltip.x > width / 2 ? 'translateX(calc(-100% - 20px))' : 'translateX(20px)',
                    }}
                 >
                     <strong className="block mb-1">{new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                     <ul className="space-y-0.5">
                         {tooltip.scores.map(s => <li key={s.name} className="flex items-center"><div className="w-2 h-2 rounded-full mr-1.5" style={{backgroundColor: s.color}}/>{s.name}: <strong>{s.value.toFixed(1)}</strong></li>)}
                     </ul>
                 </div>
             )}
            <div className="flex flex-row md:flex-col flex-wrap gap-x-4 gap-y-2">
                 {habits.map((habit, i) => (
                    <div key={habit.id} className="flex items-center text-sm">
                        <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span>{habit.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StreakHighlight: React.FC<{ streaks: { name: string, streak: number }[] }> = ({ streaks }) => {
    const colors = [
        { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500' },
        { bg: 'bg-gray-400/20', text: 'text-gray-300', border: 'border-gray-400' },
        { bg: 'bg-orange-600/20', text: 'text-orange-500', border: 'border-orange-600' },
    ];
    const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2L9 5H3v6l4 4-1 5 4-2 4 2-1-5 4-4V5h-6z"/></svg>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {streaks.slice(0, 3).map((s, i) => (
                <div key={s.name} className={`p-4 rounded-lg flex items-center space-x-4 border ${colors[i].bg} ${colors[i].border}`}>
                    <TrophyIcon className={`w-8 h-8 ${colors[i].text}`} />
                    <div>
                        <div className="text-sm text-text-secondary">{i === 0 ? 'Longest Streak' : i === 1 ? '2nd Longest' : '3rd Longest'}</div>
                        <div className="font-bold text-lg">{s.name}</div>
                    </div>
                    <div className={`text-3xl font-bold ml-auto ${colors[i].text}`}>{s.streak}<span className="text-sm">d</span></div>
                </div>
            ))}
        </div>
    )
};

const MonthlyAverageTable: React.FC<{ data: { name: string, avg: number }[] }> = ({ data }) => {
    if (data.length === 0) return <NoData />;
    return (
        <div className="space-y-2">
            {data.map(item => (
                <div key={item.name} className="flex justify-between items-center text-sm p-2 bg-input-bg/50 rounded">
                    <span>{item.name}</span>
                    <span className="font-mono bg-background px-2 py-0.5 rounded">{item.avg.toFixed(2)} pts/day</span>
                </div>
            ))}
        </div>
    )
};

const StreakBarChart: React.FC<{ data: { name: string, streak: number }[] }> = ({ data }) => {
    if (data.length === 0) return <NoData />;
    const maxStreak = Math.max(...data.map(d => d.streak), 1);
    return (
        <div className="space-y-3">
            {data.map((item, i) => (
                <div key={item.name} className="flex items-center gap-4 text-sm">
                    <span className="w-1/3 truncate">{item.name}</span>
                    <div className="w-2/3 bg-input-bg rounded-full h-5">
                        <div 
                            className="bg-gradient-to-r from-accent-primary-dark to-accent-primary h-5 rounded-full flex items-center justify-end pr-2 text-white font-bold" 
                            style={{ width: `${(item.streak / maxStreak) * 100}%` }}
                        >
                            {item.streak}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const Loader: React.FC = () => (
    <div className="flex items-center justify-center w-full h-full">
        <div className="w-6 h-6 border-4 border-input-bg rounded-full border-t-accent-primary animate-spin"></div>
    </div>
);

function calculateStreaks(data: AllData, habits: Habit[]): Record<string, number> {
  const streaks: Record<string, number> = {};
  for (const habit of habits) {
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const dateToCheck = new Date(today);
      dateToCheck.setDate(today.getDate() - i);
      const dateString = dateToCheck.toISOString().split('T')[0];
      const dayData = data[dateString];
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
    const { settings } = useContext(SettingsContext);
    const [summary, setSummary] = useState('Generating reflection...');
    const [isLoading, setIsLoading] = useState(true);
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

    const todayPieData = useMemo(() => {
        const todayScores = data[today]?.habitScores || {};
        return habits
            .map(habit => ({
                name: habit.name,
                value: todayScores[habit.id] || 0,
            }))
            .filter(d => d.value > 0);
    }, [data, today, habits]);

    const radarData = useMemo(() => {
        const last7Days = Object.entries(data)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .slice(0, 7);
        
        if (last7Days.length === 0) return [];

        return habits.map(habit => {
            const totalScore = last7Days.reduce((sum, [, dayData]) => sum + (dayData.habitScores?.[habit.id] || 0), 0);
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
                scores: dailyData.habitScores || {}
            }));
    }, [data]);
    
    const { dataForChart, habitsForChart, maxYForChart } = useMemo(() => {
        if (selectedTrend === 'total') {
            return {
                dataForChart: trendChartData.map(({ date, scores }) => ({
                    date,
                    scores: { 'total': Object.values(scores).reduce((sum, score) => sum + (score || 0), 0) / (habits.length || 1) }
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
                return total + Object.values(dayData.habitScores || {}).reduce((sum, score) => sum + (score || 0), 0);
            }, 0);

        const totalHabitTarget = habits.reduce((acc, habit) => acc + habit.target, 0);

        return [
            { name: 'Completed', value: totalAchieved },
            { name: 'Remaining', value: Math.max(0, totalHabitTarget - totalAchieved) }
        ];
    }, [data, habits, today]);

    const habitStreaks = useMemo(() => {
        const streaks = calculateStreaks(data, habits);
        return habits.map(h => ({
            name: h.name,
            streak: streaks[h.id] || 0,
        })).sort((a,b) => b.streak - a.streak);
    }, [data, habits]);

    const monthlyAverages = useMemo(() => {
        const currentDate = new Date(today);
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const daysSoFar = currentDate.getDate();

        const habitTotals: Record<string, number> = {};
        habits.forEach(h => habitTotals[h.id] = 0);

        for (let i = 1; i <= daysSoFar; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0];
            const dayData = data[date];
            if(dayData?.habitScores) {
                for(const habit of habits) {
                    habitTotals[habit.id] += dayData.habitScores[habit.id] || 0;
                }
            }
        }
        return habits.map(habit => ({
            name: habit.name,
            avg: (habitTotals[habit.id] || 0) / daysSoFar
        }));
    }, [data, habits, today]);

    return (
        <div className="p-6 h-full overflow-y-auto animate-fade-in">
            <h1 className="text-3xl font-bold mb-6 text-text-primary">Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 auto-rows-min gap-6">
                <Card className="lg:col-span-4">
                    <StreakHighlight streaks={habitStreaks} />
                </Card>
                
                <Card className="lg:col-span-4">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl">Habit Trends (Last 30 Days)</h3>
                        <select 
                            value={selectedTrend}
                            onChange={e => setSelectedTrend(e.target.value)}
                            className="bg-input-bg border border-border rounded-md px-2 py-1 text-sm focus:ring-accent-primary focus:border-accent-primary"
                        >
                            <option value="all">All Habits</option>
                            <option value="total">Avg Daily Score</option>
                            {habits.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>
                    </div>
                    <MultiLineTrendChart data={dataForChart} habits={habitsForChart} maxY={maxYForChart} />
                </Card>

                <Card className="lg:col-span-2 row-span-2">
                    <h3 className="font-bold text-xl mb-4">Habit Performance (Last 7 Days Avg)</h3>
                    <div className="flex justify-center items-center h-full">
                        <RadarChart data={radarData} />
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-xl mb-4">Today's Points Distribution</h3>
                    <PieChart data={todayPieData} type="pie" />
                </Card>

                <Card className="lg:col-span-2">
                     <h3 className="font-bold text-xl mb-4">Monthly Daily Average</h3>
                     <MonthlyAverageTable data={monthlyAverages} />
                </Card>

                <Card className="lg:col-span-2 row-span-2">
                    <h3 className="font-bold text-xl mb-4">Habit Streaks</h3>
                    <StreakBarChart data={habitStreaks} />
                </Card>

                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-xl mb-2">AI Daily Reflection</h3>
                    <div className="text-text-secondary whitespace-pre-wrap mb-4 min-h-[120px] flex items-center">
                        {isLoading ? <Loader /> : <p className="w-full text-sm">{summary}</p>}
                    </div>
                    <Button onClick={handleGenerateSummary} disabled={isLoading}>
                        {isLoading ? 'Regenerating...' : 'Regenerate'}
                    </Button>
                </Card>
                
                <Card>
                    <h3 className="font-bold text-xl mb-2">Monthly Target</h3>
                    <PieChart data={overallProgressData} type="donut" />
                </Card>

                <Card className="flex flex-col items-center justify-center">
                    <h3 className="font-bold text-xl mb-2">Current Time</h3>
                    <p className="text-4xl font-mono">
                        {time.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: settings.timeFormat === '12h'
                        })}
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;