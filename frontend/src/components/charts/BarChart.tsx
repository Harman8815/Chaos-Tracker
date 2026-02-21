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
    normalColor = "#8840ff",
    hoverColor = "#eab308",
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
            <div className="p-6 text-center text-gray-400">
                No data available.
            </div>
        );
    }

    return (
        <div className="w-full bg-transparent rounded-xl p-2">
            <h2 className="text-xl font-semibold mb-4 text-white tracking-wide">
                {title}
            </h2>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart
                    data={displayData}
                    margin={{ top: 20, right: 0, left: -30, bottom: -40 }}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#ccc", fontSize: 12 }}
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        tick={{ fill: "#eee", fontSize: 12 }}
                        tickLine={{ stroke: "#444" }}
                        axisLine={{ stroke: "#444" }}
                    />
                    <Tooltip
                        formatter={(v: number) => Number(v.toFixed(2))}
                        contentStyle={{
                            backgroundColor: "#1d2430",
                            border: "1px solid #333",
                            borderRadius: "8px",
                        }}
                        cursor={{ fill: "#0000002a" }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#ddd" }}
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
