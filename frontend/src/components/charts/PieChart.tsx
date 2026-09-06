import React from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

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

const NoData: React.FC = () => (
  <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">
    Not enough data to display.
  </div>
);

const formatValue = (value: number) => Number(value.toFixed(2));

const PieChart: React.FC<{
  data: { name: string; value: number }[];
  type?: 'pie' | 'donut';
  title?: string;
  height?: number;
}> = ({ data, type = 'pie', title, height = 200 }) => {
  if (!data || data.length === 0 || data.every((d) => d.value === 0)) {
    return <NoData />;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center gap-4 w-full" style={{ height }}>
      {title && <h4 className="text-sm font-medium text-text-secondary">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={type === 'donut' ? undefined : 80}
            innerRadius={type === 'donut' ? 50 : 0}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} style={{ fill: CHART_COLORS[index % CHART_COLORS.length] }} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatValue(value), 'Value']}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
            }}
            labelStyle={{ color: 'var(--color-text-primary)' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((slice, i) => (
          <div key={slice.name} className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-sm mr-2"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span>
              {slice.name} ({total > 0 ? ((slice.value / total) * 100).toFixed(0) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { PieChart, NoData };
export default PieChart;
