import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

const formatValue = (value: number) => Number(value.toFixed(2));

const RadarChart: React.FC<{ data: { axis: string; value: number }[] }> = ({ data }) => {
  const domain = useMemo(() => {
    if (!data || data.length === 0) return [0, 10];
    const max = Math.max(...data.map((d) => d.value), 1);
    return [0, max > 0 ? Math.ceil(max * 1.15) : 10];
  }, [data]);

  if (!data || data.length < 3) {
    return (
      <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">
        Not enough data to display.
      </div>
    );
  }

  const outerRadius = 80;
  const cx = '50%';
  const cy = '50%';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart
        data={data}
        cx={cx}
        cy={cy}
        outerRadius={outerRadius}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={1.5}
          strokeOpacity={0.6}
        />
        <PolarGrid stroke="var(--color-border)" strokeOpacity={0.25} />
        <PolarAngleAxis dataKey="axis" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
        <PolarRadiusAxis domain={domain} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
        <Radar
          name="Avg Score"
          dataKey="value"
          stroke="var(--color-accent-primary)"
          fill="var(--color-accent-primary)"
          fillOpacity={0.5}
        />
        <Tooltip
          formatter={(value: number) => [formatValue(value), 'Avg Score']}
          contentStyle={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
          }}
          labelStyle={{ color: 'var(--color-text-primary)' }}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export { RadarChart };
