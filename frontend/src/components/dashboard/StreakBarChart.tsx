import React, { useState } from 'react';
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

const StreakBarChart: React.FC<{ data: { name: string, streak: number }[] }> = ({ data }) => {
    const [expanded, setExpanded] = useState(false);
    const displayData = expanded ? data : data.slice(0, 5);

    if (data.length === 0) {
        return (
            <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">
                Not enough data to display.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="w-full" style={{ height: expanded ? Math.max(displayData.length * 40, 200) : 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                            stroke="var(--color-border)"
                        />
                        <YAxis
                            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                            stroke="var(--color-border)"
                        />
                        <Tooltip
                            formatter={(value: number) => [formatValue(value), 'Streak']}
                            contentStyle={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '6px',
                            }}
                            labelStyle={{ color: 'var(--color-text-primary)' }}
                            itemStyle={{ color: 'var(--color-info)' }}
                        />
                        <Bar dataKey="streak" radius={[4, 4, 0, 0]}>
                            {displayData.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill="var(--color-accent-primary)"
                                />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>

            {data.length > 5 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full text-xs text-center text-accent-primary hover:text-accent-primary-hover pt-2 border-t border-white/10 border-dashed transition-colors focus:outline-none uppercase font-bold tracking-wide"
                >
                    {expanded ? 'Show Less' : `+ ${data.length - 5} More`}
                </button>
            )}
        </div>
    );
};

export { StreakBarChart };
