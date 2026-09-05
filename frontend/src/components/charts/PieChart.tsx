import React, { useState } from 'react';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#14b8a6'];

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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-md shadow-lg pointer-events-none text-center z-10">
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

export { PieChart, NoData };
