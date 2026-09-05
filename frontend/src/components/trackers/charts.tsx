import React, { useState, useMemo } from 'react';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#14b8a6'];

const PieChart: React.FC<{ data: { name: string; value: number }[], colors?: string[] }> = ({ data, colors = CHART_COLORS }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">No data to display.</div>;

    let startAngle = -90;
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
            <svg width="150" height="150" viewBox="0 0 150 150">
                {data.map((slice, i) => {
                    const angle = (slice.value / total) * 360;
                    const endAngle = startAngle + angle;
                    const x1 = 75 + 75 * Math.cos(startAngle * Math.PI / 180);
                    const y1 = 75 + 75 * Math.sin(startAngle * Math.PI / 180);
                    const x2 = 75 + 75 * Math.cos(endAngle * Math.PI / 180);
                    const y2 = 75 + 75 * Math.sin(endAngle * Math.PI / 180);
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const pathData = `M 75,75 L ${x1},${y1} A 75,75 0 ${largeArcFlag},1 ${x2},${y2} Z`;
                    startAngle = endAngle;
                    return <path key={slice.name} d={pathData} fill={colors[i % colors.length]} />;
                })}
            </svg>
            <div className="flex flex-col space-y-1">
                {data.map((slice, i) => (
                    <div key={slice.name} className="flex items-center text-sm">
                        <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colors[i % colors.length] }} />
                        <span>{slice.name} ({((slice.value / total) * 100).toFixed(0)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BarChart: React.FC<{ data: { label: string; value: number }[], color?: string }> = ({ data, color = '#6366f1' }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="flex justify-around items-end h-48 w-full gap-4 px-2">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center justify-end h-full w-full">
                    <div className="text-sm font-bold text-white">{item.value}</div>
                    <div
                        className="w-full rounded-t-md bg-accent-primary"
                        style={{ height: `${(item.value / maxValue) * 80}%` }}
                    />
                    <div className="text-xs text-text-secondary mt-1">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

export { PieChart, BarChart };

