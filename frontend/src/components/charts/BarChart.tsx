import React, { useMemo, useState } from "react";
import {
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from "recharts";

interface ChartProps {
    title: string;
    data: { name: string; value: number }[];
    height?: number;
    totalBars?: number;
    normalColor?: string; // default bar color
    hoverColor?: string; // highlighted bar color
    highlightedBarName?: string; // name of bar to highlight (e.g., current date)
}

const BarChart: React.FC<ChartProps> = ({
    title,
    data,
    height = 250,
    totalBars,
    normalColor = "var(--color-accent-primary)",
    hoverColor = "var(--color-accent-primary-hover)",
    highlightedBarName,
}) => {
    // Default to today's date number if not provided
    const defaultHighlight = new Date().getDate().toString();
    const highlightName = highlightedBarName ?? defaultHighlight;

    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const displayData = useMemo(() => {
        if (!totalBars) {
            return data.map(d => ({ ...d, value: Number(d.value.toFixed(2)) }));
        }
        const map = new Map(data.map(d => [d.name, d.value]));
        const result: { name: string; value: number }[] = [];
        for (let i = 1; i <= totalBars; i++) {
            const name = i.toString();
            const rawValue = map.get(name) ?? 0;
            result.push({ name, value: Number(rawValue.toFixed(2)) });
        }
        return result;
    }, [data, totalBars]);

    const highlightedIndex = useMemo(
        () => displayData.findIndex(d => d.name === highlightName),
        [displayData, highlightName]
    );

    if (!data || data.length === 0) {
        return (
            <div className="p-6 text-center text-text-secondary">
                No data available.
            </div>
        );
    }

    return (
        <div className="w-full bg-transparent rounded-lg p-2">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
                {title}
            </h2>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart
                    data={displayData}
                    margin={{ top: 20, right: 0, left: -30, bottom: -40 }}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
                        tickLine={{ stroke: "var(--color-border)" }}
                        axisLine={{ stroke: "var(--color-border)" }}
                    />
                    <Tooltip
                        formatter={(v: number) => Number(v.toFixed(2))}
                        contentStyle={{
                            backgroundColor: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "6px",
                        }}
                        cursor={{ fill: "var(--color-surface)" }}
                        labelStyle={{ color: "var(--color-text-primary)" }}
                        itemStyle={{ color: "var(--color-text-secondary)" }}
                    />
                    <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        onMouseEnter={(_, index) => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        {displayData.map((entry, index) => {
                            const isHover = hoverIndex === index;
                            const cellStyle: React.CSSProperties = {
                                transition: "all 180ms ease",
                                transformOrigin: "center bottom",
                            };
                            return (
                                <Cell
                                    key={index}
                                    fill={isHover || index === highlightedIndex ? hoverColor : normalColor}
                                    style={cellStyle}
                                />
                            );
                        })}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;
