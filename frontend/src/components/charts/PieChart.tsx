import React from "react";
import {
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";

interface PieProps {
    data: { name: string; value: number }[];
    title: string;
}

const COLORS = [
    "#38bdf8", "#a855f7", "#f472b6", "#fb923c", "#34d399",
    "#facc15", "#60a5fa", "#818cf8", "#c084fc", "#e879f9",
    "#4ade80", "#2dd4bf", "#fcd34d", "#f97316", "#ef4444",
    "#22d3ee", "#93c5fd", "#bbf7d0", "#fde047", "#fca5a5",
];

const PieChart: React.FC<PieProps> = ({ data, title }) => {
    if (!data || data.length === 0) {
        return (
            <div className="p-6 text-center text-gray-400">
                No data available.
            </div>
        );
    }
    const round2 = (num: number) => Number(num.toFixed(2));

    return (
        <div className="w-full bg-transparent rounded-xl p-6">
            {/* HEADER */}
            <h2 className="text-xl font-semibold mb-4 text-white tracking-wide">
                {title}
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-4">

                {/* PIE CHART */}
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={110}
                            paddingAngle={2}
                            dataKey="value"
                            labelLine={false}
                            label={({ name, percent = 0 }) =>
                                `${name} (${round2(percent * 100)}%)`
                            }

                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                    style={{ opacity: 0.9 }}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1d2430",
                                border: "1px solid #333",
                                borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#fff" }}
                            itemStyle={{ color: "#ddd" }}
                        />
                    </RechartsPieChart>
                </ResponsiveContainer>

                {/* LEGENDS — scrollable for 20+ items */}
                <div className="max-h-64 overflow-y-auto pr-2 text-sm space-y-2">
                    {data.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span>{entry.name} — {round2(entry.value)}</span>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default PieChart;
