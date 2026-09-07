import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

const formatValue = (value: number) => Number(value.toFixed(2));

const WeeklyPerformanceChart: React.FC<{ data: { day: string, score: number }[] }> = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">
                Not enough data to display.
            </div>
        );
    }

    const maxScore = Math.max(...data.map(d => d.score), 1);
    const bestDay = data.reduce((prev, current) => (prev.score > current.score) ? prev : current);

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                        dataKey="day"
                        tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                        stroke="var(--color-border)"
                    />
                    <YAxis
                        tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                        stroke="var(--color-border)"
                    />
                    <Tooltip
                        formatter={(value: number) => [`${formatValue(value)} avg`, 'Score']}
                        contentStyle={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                        }}
                        labelStyle={{ color: 'var(--color-text-primary)' }}
                        itemStyle={{ color: 'var(--color-info)' }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {data.map((entry) => (
                            <Cell
                                key={entry.day}
                                fill={entry.day === bestDay.day ? 'var(--color-warning)' : 'var(--color-accent-primary)'}
                            />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export { WeeklyPerformanceChart };
