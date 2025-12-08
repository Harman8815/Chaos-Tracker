import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

interface ChartProps {
    title: string;
    data: { name: string; value: number }[];
    height?: number;
    totalBars?: number; // number of bars to display (e.g., days in month)
}

const BarChart: React.FC<ChartProps> = ({ title, data, height = 350, totalBars }) => {
    const displayData = useMemo(() => {
        if (!totalBars) return data.map(d => ({
            ...d,
            value: Number(d.value.toFixed(2))
        }));

        const dataMap = new Map(data.map(d => [d.name, d.value]));
        const result: { name: string; value: number }[] = [];

        for (let i = 1; i <= totalBars; i++) {
            const name = i.toString();
            const rawValue = dataMap.get(name) ?? 0;

            result.push({
                name,
                value: Number(rawValue.toFixed(2))
            });
        }

        return result;
    }, [data, totalBars]);

    if (!data || data.length === 0) {
        return (
            <div className="p-6 text-center text-gray-400">
                No data available.
            </div>
        );
    }

    return (
        <div className="w-full bg-transparent rounded-xl p-6">

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4 text-white tracking-wide">
                {title}
            </h2>

            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={displayData} margin={{ top: 10, right: 0, left: -10, bottom: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

                    {/* Category Labels */}
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#ccc", fontSize: 12 }}
                        interval={0}                // ensures 20+ items show
                        angle={-35}                 // rotates ticks for visibility
                        textAnchor="end"
                        height={60}
                    />

                    {/* Tick Marks on Y-axis */}
                    <YAxis
                        tick={{ fill: "#eee", fontSize: 12 }}
                        tickLine={{ stroke: "#444" }}
                        axisLine={{ stroke: "#444" }}
                    />

                    {/* Tooltip */}
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1d2430",
                            border: "1px solid #333",
                            borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#ddd" }}
                    />

                    <Bar
                        dataKey="value"
                        fill="rgba(56,189,248,0.8)"        // cyan translucent
                        radius={[6, 6, 0, 0]}
                    />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;
