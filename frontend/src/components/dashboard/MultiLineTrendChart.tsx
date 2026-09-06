import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Habit } from '../../types';

const CHART_COLORS = [
  'hsl(var(--color-accent-primary))',
  'hsl(var(--color-accent-secondary))',
  'hsl(var(--color-info))',
  'hsl(var(--color-success))',
  'hsl(var(--color-warning))',
  'hsl(var(--color-destructive))',
  'hsl(var(--color-info))',
  'hsl(var(--color-success))',
];

const MultiLineTrendChart: React.FC<{
  data: { date: string; scores: { [habitId: string]: number } }[];
  habits: Habit[];
  maxY?: number;
}> = ({ data, habits, maxY }) => {
  const chartData = useMemo(() => {
    return data.map((d) => {
      const entry: Record<string, string | number> = {
        date: new Date(d.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      };
      habits.forEach((h) => {
        entry[h.id] = Number((d.scores[h.id] ?? 0).toFixed(2));
      });
      return entry;
    });
  }, [data, habits]);

  const yDomain = useMemo(() => {
    if (typeof maxY === 'number' && maxY > 0) return [0, maxY];
    let max = 0;
    data.forEach((d) => {
      habits.forEach((h) => {
        const v = d.scores[h.id] ?? 0;
        if (v > max) max = v;
      });
    });
    return [0, max > 0 ? Math.ceil(max * 1.1) : 10];
  }, [data, habits, maxY]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">
        Not enough data to display.
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="var(--color-border)"
          />
          <YAxis
            domain={yDomain}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="var(--color-border)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
            }}
            labelStyle={{ color: 'var(--color-text-primary)' }}
          />
          <Legend />
          {habits.map((habit, index) => (
            <Line
              key={habit.id}
              type="monotone"
              dataKey={habit.id}
              name={habit.name}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export { MultiLineTrendChart };
