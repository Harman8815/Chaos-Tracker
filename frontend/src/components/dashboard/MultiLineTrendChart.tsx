import React, { useState, useRef } from 'react';
import { Habit } from '../../types';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#14b8a6'];

const MultiLineTrendChart: React.FC<{ data: { date: string, scores: { [habitId: string]: number } }[], habits: Habit[], maxY: number }> = ({ data, habits, maxY }) => {
    const [tooltip, setTooltip] = useState<{ index: number, x: number, date: string, scores: any[] } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    if (!data || data.length === 0) return <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">Not enough data to display.</div>;

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
        });

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
                    {Array.from({ length: 6 }, (_, i) => i * (maxY / 5)).map(val => (
                        <g key={val}>
                            <text x={padding - 10} y={getY(val)} dy="0.3em" textAnchor="end" className="text-xs fill-current text-text-secondary">{val.toFixed(0)}</text>
                            <line x1={padding} x2={width - padding} y1={getY(val)} y2={getY(val)} className="stroke-current text-text-tertiary opacity-10" />
                        </g>
                    ))}
                    {data.map((d, i) => (i % Math.ceil(data.length / 6) === 0 &&
                        <text key={i} x={getX(i)} y={height - padding + 15} textAnchor="middle" className="text-xs fill-current text-text-secondary">
                            {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </text>
                    ))}
                    {habits.map((habit, habitIndex) => {
                        const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.scores[habit.id] || 0)}`).join(' ');
                        return <path key={habit.id} d={linePath} strokeWidth="2" fill="none" stroke={CHART_COLORS[habitIndex % CHART_COLORS.length]} />;
                    })}
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
                <div className="absolute p-2 bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-md shadow-lg text-xs pointer-events-none z-10"
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

export { MultiLineTrendChart };
