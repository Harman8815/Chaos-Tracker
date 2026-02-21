
import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { DataContext } from '../context/DataContext';
import { SettingsContext } from '../context/SettingsContext';
import { getAIPoweredSummary } from '../services/geminiService';
import { dashboardService } from '../services/dashboardService';
import Card from './ui/Card';
import Button from './ui/Button';
import { Habit, AllData, DailyData } from '../types';
import { marked } from 'marked';

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
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full h-full">
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-card-bg/80 backdrop-blur-sm border border-border rounded-md shadow-lg pointer-events-none text-center z-10">
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

    // Increased size for better visualization
    const size = 600;
    const center = size / 2;
    const radius = size * 0.35; // Adjusted radius to fit labels
    const levels = 5;
    const maxValue = 10;
    const angleSlice = (Math.PI * 2) / data.length;

    const getPoint = (angle: number, value: number) => ({
        x: center + (radius * value / maxValue) * Math.cos(angle - Math.PI / 2),
        y: center + (radius * value / maxValue) * Math.sin(angle - Math.PI / 2),
    });

    const pointsToString = (points: { x: number, y: number }[]) => points.map(p => `${p.x},${p.y}`).join(' ');

    const dataPoints = data.map((d, i) => getPoint(angleSlice * i, d.value));

    return (
        <div className="relative w-full h-full flex items-center justify-center min-h-[500px]">
            <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-4xl" preserveAspectRatio="xMidYMid meet">
                {/* Data Polygon - Rendered first so grid lines overlay it */}
                <polygon points={pointsToString(dataPoints)} className="fill-accent-primary/60 stroke-accent-primary" strokeWidth="3" />

                {/* Grid - Rendered on top */}
                {[...Array(levels)].map((_, levelIndex) => (
                    <polygon
                        key={levelIndex}
                        points={pointsToString(data.map((_, i) => getPoint(angleSlice * i, maxValue * (levels - levelIndex) / levels)))}
                        className="stroke-text-disabled fill-transparent opacity-40"
                        strokeWidth="1"
                    />
                ))}
                {/* Axes - Rendered on top */}
                {data.map((_, i) => {
                    const p = getPoint(angleSlice * i, maxValue);
                    return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} className="stroke-text-disabled opacity-40" />;
                })}

                {/* Labels */}
                {data.map((d, i) => {
                    const p = getPoint(angleSlice * i, maxValue * 1.15);
                    const angleDeg = (angleSlice * i * 180 / Math.PI) - 90;
                    let textAnchor: "middle" | "start" | "end" = "middle";
                    if (angleDeg > 10 && angleDeg < 170) textAnchor = "start";
                    if (angleDeg < -10 && angleDeg > -170) textAnchor = "end";

                    return (
                        <text
                            key={i}
                            x={p.x}
                            y={p.y}
                            textAnchor={textAnchor as any}
                            dy="0.3em"
                            className="text-xs md:text-sm font-semibold fill-text-secondary"
                        >
                            {d.axis}
                        </text>
                    );
                })}

                {/* Data points for hover */}
                {dataPoints.map((p, i) => (
                    <circle
                        key={`hover-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r="6"
                        className="fill-card-bg stroke-accent-primary cursor-pointer hover:fill-accent-primary transition-colors"
                        strokeWidth="2"
                        onMouseEnter={() => setHoveredPoint({ ...data[i], x: p.x, y: p.y })}
                        onMouseLeave={() => setHoveredPoint(null)}
                    />
                ))}
            </svg>
            {hoveredPoint && (
                <div
                    className="absolute p-3 bg-card-bg/95 backdrop-blur-sm border border-border rounded-lg shadow-xl text-sm pointer-events-none z-20"
                    style={{ left: '50%', top: '50%', transform: `translate(calc(-50% + ${hoveredPoint.x - center}px), calc(-50% + ${hoveredPoint.y - center}px - 50px))` }}
                >
                    <div className="font-bold text-accent-primary text-base mb-1">{hoveredPoint.axis}</div>
                    <div className="text-text-primary font-mono">Avg Score: {hoveredPoint.value.toFixed(2)}</div>
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

        const habitColors: { [key: string]: string } = {};
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
        <div className="flex flex-col gap-4 relative w-full">
            <div className="w-full overflow-x-auto">
                <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="w-full min-w-[600px] h-auto cursor-crosshair">
                    {/* Axes and Grid */}
                    {Array.from({ length: 6 }, (_, i) => i * (maxY / 5)).map(val => (
                        <g key={val}>
                            <text x={padding - 10} y={getY(val)} dy="0.3em" textAnchor="end" className="text-xs fill-current text-text-secondary">{val.toFixed(0)}</text>
                            <line x1={padding} x2={width - padding} y1={getY(val)} y2={getY(val)} className="stroke-current text-text-disabled opacity-20" />
                        </g>
                    ))}
                    {data.map((d, i) => (i % Math.ceil(data.length / 6) === 0 &&
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
            </div>
            {tooltip && (
                <div className="absolute p-2 bg-card-bg/90 backdrop-blur-sm border border-border rounded-md shadow-lg text-xs pointer-events-none z-10"
                    style={{
                        top: `10px`,
                        left: `${(tooltip.x / width) * 100}%`,
                        transform: tooltip.x > width / 2 ? 'translateX(calc(-100% - 20px))' : 'translateX(20px)',
                    }}
                >
                    <strong className="block mb-1">{new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                    <ul className="space-y-0.5">
                        {tooltip.scores.map(s => <li key={s.name} className="flex items-center"><div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: s.color }} />{s.name}: <strong>{s.value.toFixed(1)}</strong></li>)}
                    </ul>
                </div>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                {habits.map((habit, i) => (
                    <div key={habit.id} className="flex items-center text-xs md:text-sm">
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
        { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
        { bg: 'bg-gray-400/10', text: 'text-gray-300', border: 'border-gray-400/30' },
        { bg: 'bg-orange-600/10', text: 'text-orange-500', border: 'border-orange-600/30' },
    ];
    const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2L9 5H3v6l4 4-1 5 4-2 4 2-1-5 4-4V5h-6z" /></svg>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {streaks.slice(0, 3).map((s, i) => (
                <div key={s.name} className={`p-4 rounded-lg flex items-center space-x-4 border ${colors[i].bg} ${colors[i].border}`}>
                    <TrophyIcon className={`w-8 h-8 ${colors[i].text}`} />
                    <div className="min-w-0 flex-1">
                        <div className="text-xs text-text-secondary uppercase tracking-wider">{i === 0 ? 'Longest' : i === 1 ? '2nd' : '3rd'}</div>
                        <div className="font-bold text-lg truncate">{s.name}</div>
                    </div>
                    <div className={`text-2xl font-bold ${colors[i].text}`}>{s.streak}<span className="text-sm ml-0.5">d</span></div>
                </div>
            ))}
        </div>
    )
};

const MonthlyAverageTable: React.FC<{ data: { name: string, avg: number }[] }> = ({ data }) => {
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'avg'; direction: 'asc' | 'desc' }>({ key: 'avg', direction: 'desc' });

    const sortedData = useMemo(() => {
        const sorted = [...data];
        sorted.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [data, sortConfig]);

    const requestSort = (key: 'name' | 'avg') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (data.length === 0) return <NoData />;

    return (
        <div className="absolute inset-0 flex flex-col">
            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border pb-2 pr-2 select-none bg-card-bg sticky top-0 z-10">
                 <div 
                    className="col-span-2 cursor-pointer flex items-center hover:text-text-primary transition-colors" 
                    onClick={() => requestSort('name')}
                    title="Sort by Name"
                 >
                    Habit {sortConfig.key === 'name' && <span className="ml-1 text-accent-primary">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                 </div>
                 <div 
                    className="col-span-1 text-right cursor-pointer flex items-center justify-end hover:text-text-primary transition-colors" 
                    onClick={() => requestSort('avg')}
                    title="Sort by Average Score"
                 >
                    Avg {sortConfig.key === 'avg' && <span className="ml-1 text-accent-primary">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                 </div>
            </div>
            
            <div className="overflow-y-auto flex-grow custom-scrollbar">
                {sortedData.map(item => (
                    <div key={item.name} className="grid grid-cols-3 gap-2 text-sm p-3 hover:bg-input-bg/50 rounded border-b border-border/30 last:border-0 transition-colors">
                        <div className="col-span-2 truncate font-medium text-text-primary" title={item.name}>{item.name}</div>
                        <div className="col-span-1 text-right font-mono text-accent-primary bg-input-bg/30 rounded px-2 py-0.5">{item.avg.toFixed(2)}</div>
                    </div>
                ))}
            </div>
        </div>
    )
};

const StreakBarChart: React.FC<{ data: { name: string, streak: number }[] }> = ({ data }) => {
    const [expanded, setExpanded] = useState(false);

    if (data.length === 0) return <NoData />;

    const maxStreak = Math.max(...data.map(d => d.streak), 1);
    const displayData = expanded ? data : data.slice(0, 5);

    return (
        <div className="space-y-4">
            <div className={`space-y-4 transition-all duration-300 ease-in-out`}>
                {displayData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 text-sm">
                        <span className="w-24 truncate text-right text-text-secondary" title={item.name}>{item.name}</span>
                        <div className="flex-grow bg-input-bg rounded-full h-3 relative overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-accent-primary-dark to-accent-primary h-full rounded-full absolute top-0 left-0 transition-all duration-500"
                                style={{ width: `${(item.streak / maxStreak) * 100}%` }}
                            />
                        </div>
                        <span className="w-8 font-bold text-right">{item.streak}</span>
                    </div>
                ))}
            </div>

            {data.length > 5 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full text-xs text-center text-accent-primary hover:text-accent-primary-dark pt-2 border-t border-border border-dashed transition-colors focus:outline-none uppercase font-bold tracking-wide"
                >
                    {expanded ? 'Show Less' : `+ ${data.length - 5} More`}
                </button>
            )}
        </div>
    )
}

const StreakStats: React.FC<{ streaks: { name: string, streak: number }[] }> = ({ streaks }) => {
    const active = streaks.filter(s => s.streak > 0).length;
    const total = streaks.length;
    const best = streaks.length > 0 ? Math.max(...streaks.map(s => s.streak)) : 0;
    const avg = streaks.length > 0 ? streaks.reduce((acc, curr) => acc + curr.streak, 0) / total : 0;

    return (
        <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-input-bg/30 rounded">
                <div className="text-lg font-bold text-accent-primary">{active}/{total}</div>
                <div className="text-[10px] uppercase tracking-wider text-text-secondary">Active</div>
            </div>
            <div className="p-2 bg-input-bg/30 rounded">
                <div className="text-lg font-bold text-green-500">{best}</div>
                <div className="text-[10px] uppercase tracking-wider text-text-secondary">Best Streak</div>
            </div>
            <div className="p-2 bg-input-bg/30 rounded">
                <div className="text-lg font-bold text-blue-500">{avg.toFixed(1)}</div>
                <div className="text-[10px] uppercase tracking-wider text-text-secondary">Avg Streak</div>
            </div>
        </div>
    );
}

const WeeklyPerformanceChart: React.FC<{ data: { day: string, score: number }[] }> = ({ data }) => {
    if (data.length === 0) return <NoData />;
    const maxScore = Math.max(...data.map(d => d.score), 1);
    const bestDay = data.reduce((prev, current) => (prev.score > current.score) ? prev : current);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex justify-center items-end flex-grow gap-3 pb-2 h-full w-full px-4">
                {data.map(item => {
                    const isBest = item.day === bestDay.day;
                    return (
                        <div key={item.day} className="flex flex-col items-center justify-end h-full w-full max-w-[40px] group relative">
                            <div className="absolute -top-8 text-xs bg-card-bg px-2 py-1 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-md">
                                {item.score.toFixed(1)} avg
                            </div>
                            <div
                                className={`w-full rounded-t-md transition-all duration-300 ${isBest ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]' : 'bg-accent-primary opacity-90 hover:opacity-100 hover:brightness-110'}`}
                                style={{ height: `${(item.score / maxScore) * 100}%`, minHeight: '4px' }}
                            />
                            <div className={`text-[10px] mt-2 font-medium ${isBest ? 'text-yellow-500 font-bold' : 'text-text-secondary'}`}>{item.day}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

const MarkdownView: React.FC<{ content: string }> = ({ content }) => {
    const [html, setHtml] = useState('');

    useEffect(() => {
        if (!content) {
            setHtml('');
            return;
        }
        try {
            // marked.parse returns string | Promise<string> in newer versions
            const result = marked.parse(content, { breaks: true, gfm: true });
            if (result instanceof Promise) {
                result.then(setHtml);
            } else {
                setHtml(result);
            }
        } catch (e) {
            console.error("Markdown parsing error", e);
            setHtml(content);
        }
    }, [content]);

    return (
        <div
            className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

const Loader: React.FC = () => (
    <div className="flex items-center justify-center w-full h-full py-8">
        <div className="w-8 h-8 border-4 border-input-bg rounded-full border-t-accent-primary animate-spin"></div>
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
            const dayData = data[dateString] as DailyData | undefined;
            const score = dayData?.habitScores?.[habit.id] ?? 0;
            if (score > 0) {
                currentStreak++;
            } else {
                // Allow one skip day maybe? For now strict streak.
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

    // Fetch analytics from server and keep as optional override
    useEffect(() => {
        let mounted = true;

        const fetchAnalytics = async () => {
            try {
                const streaksRes = await dashboardService.getStreaks();
                if (mounted && streaksRes?.streaks) setServerStreaks(streaksRes.streaks.map((s: any) => ({ name: s.name, streak: s.current_streak })));

                const distRes = await dashboardService.getTodayDistribution();
                // backend now returns per-habit distribution under `habits`
                if (mounted && distRes?.habits) setTodayDistributionServer(distRes.habits);

                const perfRes = await dashboardService.getHabitPerformance7();
                if (mounted && perfRes?.data) setHabitPerf7Server(perfRes.data);
            } catch (e) {
                // Non-fatal - keep client-side computed values
                console.debug('Analytics endpoints unavailable or failed', e);
            }
        };

        fetchAnalytics();
        return () => { mounted = false };
    }, [habits]);

    const todayPieData = useMemo(() => {
        // Prefer server-provided distribution (array of { habit_id, name, score, percentage })
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

    // Gamification Stats
    const levelStats = useMemo(() => {
        let totalXP = 0;
        Object.values(data).forEach((day) => {
            const d = day as DailyData;
            if (d.habitScores) {
                totalXP += Object.values(d.habitScores).reduce((sum, s) => sum + (Number(s) || 0), 0);
            }
        });

        // Simple level formula: Level = floor(sqrt(XP / 10))
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
        <div className="p-6 h-full overflow-y-auto animate-fade-in pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">{t('dashboard')}</h1>
                <div className="text-sm text-text-secondary">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Row 1: Highlights */}
                <Card className="lg:col-span-4">
                    <StreakHighlight streaks={habitStreaks} />
                </Card>

                {/* Row 2: Trend Chart */}
                <Card className="lg:col-span-4">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <h3 className="font-bold text-xl">Habit Trends (30 Days)</h3>
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

                {/* Row 3: Radar Chart - Full Width */}
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-xl mb-4">Habit Performance (7 Days)</h3>
                    <div className="w-full h-[500px]">
                        <RadarChart data={radarData} />
                    </div>
                </Card>

                 {/* Row 4: Pie Chart & Weekly Performance */}
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-xl mb-4">Today's Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        <PieChart data={todayPieData} type="pie" />
                    </div>
                </Card>

                 {/* Row 5: Habit Streaks & Monthly Average (Neighbors to share height) */}
                <Card className="lg:col-span-2 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl">Habit Streaks</h3>
                            <span className="text-xs text-text-secondary">Current</span>
                        </div>
                        <div className="mb-4">
                            <StreakBarChart data={habitStreaks} />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-border mt-auto">
                        <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Analytics</h4>
                        <StreakStats streaks={habitStreaks} />
                    </div>
                </Card>

                <Card className="lg:col-span-2 flex flex-col h-full">
                    <h3 className="font-bold text-xl mb-4 flex-shrink-0">Monthly Daily Average</h3>
                    {/* Wrapper with relative positioning and flex-grow allows the absolute child to fill available space without pushing parent height, effectively depending on neighbor's height in the grid row. */}
                    <div className="relative flex-grow min-h-[200px]">
                         <MonthlyAverageTable data={monthlyAverages} />
                    </div>
                </Card>

                {/* Row 6: Weekly Performance & Your Journey */}
                <Card className="lg:col-span-2 flex flex-col">
                    <h3 className="font-bold text-xl mb-4">Weekly Performance</h3>
                    <div className="flex-grow min-h-[200px]">
                        <WeeklyPerformanceChart data={weeklyPerformance} />
                    </div>
                    {bestDay && (
                        <div className="mt-4 pt-4 border-t border-border text-center">
                            <p className="text-sm text-text-secondary">Your most productive day is <span className="text-yellow-500 font-bold text-lg">{bestDay.day}</span></p>
                        </div>
                    )}
                </Card>

                <Card className="lg:col-span-2 relative overflow-hidden group">
                    {/* Background visual for gamification */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl">Tracker Rank</h3>
                                <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {levelStats.rank}
                                </div>
                            </div>

                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-purple-400">
                                    {levelStats.level}
                                </span>
                                <span className="text-sm text-text-secondary font-bold mb-2">LEVEL</span>
                            </div>

                            <div className="w-full h-6 bg-input-bg rounded-full overflow-hidden mb-2 relative shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-primary to-purple-500 transition-all duration-1000 ease-out relative"
                                    style={{ width: `${(levelStats.progress / levelStats.needed) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                    {Math.round((levelStats.progress / levelStats.needed) * 100)}% to Lvl {levelStats.level + 1}
                                </span>
                            </div>

                            <div className="flex justify-between text-xs text-text-secondary font-mono">
                                <span>{levelStats.progress} XP</span>
                                <span>{levelStats.needed} XP</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-card-bg rounded-lg border border-border shadow-sm text-center">
                                <div className="text-2xl font-bold text-text-primary">{levelStats.totalXP.toLocaleString()}</div>
                                <div className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Lifetime XP</div>
                            </div>
                            <div className="p-4 bg-card-bg rounded-lg border border-border shadow-sm text-center">
                                <div className="text-2xl font-bold text-text-primary">{Object.keys(data).length}</div>
                                <div className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Days Active</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Row 6: AI & Targets */}
                <Card className="lg:col-span-2 flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            AI Daily Reflection
                            <span className="text-xs font-normal bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full">Beta</span>
                        </h3>
                    </div>
                    <div className="text-text-secondary mb-4 flex-grow overflow-y-auto max-h-96 p-2 bg-input-bg/20 rounded-lg border border-border/50">
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

                <Card className="lg:col-span-2">
                    <div className="flex flex-col items-center justify-between h-full p-4">
                        <h3 className="font-bold text-xl mb-4 w-full text-left">Monthly Target</h3>
                        <div className="w-full flex-grow flex items-center justify-center">
                            <PieChart data={overallProgressData} type="donut" />
                        </div>
                        <div className="text-center mt-4 pt-4 border-t border-border w-full">
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
            <style>{`
                .prose ul {
                    list-style-type: disc;
                    padding-left: 1.2em;
                }
                .prose ol {
                    list-style-type: decimal;
                    padding-left: 1.2em;
                }
                .prose strong {
                    color: var(--color-text-primary);
                    font-weight: 700;
                }
                .prose blockquote {
                    border-left-color: var(--color-accent-primary);
                    background-color: var(--color-input-bg);
                    padding: 0.5rem 1rem;
                    border-radius: 0.25rem;
                    font-style: italic;
                }
             `}</style>
        </div>
    );
};

export default Dashboard;
