import React from "react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const CHART_COLORS = [
  "var(--color-accent-primary)",
  "var(--color-accent-secondary)",
  "var(--color-info)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-destructive)",
  "var(--color-info)",
  "var(--color-success)",
];

const NoData: React.FC = () => (
  <div className="flex h-full items-center justify-center p-4 text-center text-text-secondary">
    Not enough data to display.
  </div>
);

const formatValue = (value: number) => Number(value.toFixed(2));

interface PieChartProps {
  data: { name: string; value: number }[];
  type?: "pie" | "donut";
  title?: string;
  height?: number | string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  type = "pie",
  title,
  height = 200,
}) => {
  if (!data || data.length === 0 || data.every((item) => item.value === 0)) {
    return <NoData />;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className="flex w-full flex-col items-center gap-4"
      style={{ height }}
    >
      {title && (
        <h4 className="shrink-0 text-sm font-medium text-text-secondary">
          {title}
        </h4>
      )}

      <div className="min-h-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={type === "donut" ? "80%" : "80%"}
              innerRadius={type === "donut" ? "50%" : 0}
              stroke="transparent"
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number) => [
                formatValue(value),
                "Value",
              ]}
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
              }}
              itemStyle={{
                color: "var(--color-text-primary)",
              }}
              labelStyle={{
                color: "var(--color-text-primary)",
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex shrink-0 flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((slice, index) => (
          <div
            key={slice.name}
            className="flex items-center text-sm"
          >
            <div
              className="mr-2 h-3 w-3 rounded-sm"
              style={{
                backgroundColor:
                  CHART_COLORS[index % CHART_COLORS.length],
              }}
            />

            <span>
              {slice.name} (
              {total > 0
                ? ((slice.value / total) * 100).toFixed(0)
                : 0}
              %)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { PieChart, NoData };
export default PieChart;