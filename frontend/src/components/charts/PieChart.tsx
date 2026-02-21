import React, { useState, useEffect, useRef } from "react";
import {
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

interface PieProps {
    data: { name: string; value: number }[];
    title: string;
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
}

const COLORS = [
    "#38bdf8", "#a855f7", "#f472b6", "#fb923c", "#34d399",
    "#facc15", "#60a5fa", "#818cf8", "#c084fc", "#e879f9",
    "#4ade80", "#2dd4bf", "#fcd34d", "#f97316", "#ef4444",
    "#22d3ee", "#93c5fd", "#bbf7d0", "#fde047", "#fca5a5",
];

const PieChart: React.FC<PieProps> = ({
    data,
    title,
    height = 250,
    innerRadius,
    outerRadius
}) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [autoInner, setAutoInner] = useState(40);
    const [autoOuter, setAutoOuter] = useState(110);

    const containerRef = useRef<HTMLDivElement>(null);

    // Auto adjust radius based on container width
    useEffect(() => {
        const updateRadius = () => {
            const width = containerRef.current?.offsetWidth || 0;

            if (width < 400) {
                setAutoInner(25);
                setAutoOuter(70);
            } else if (width < 900) {
                setAutoInner(35);
                setAutoOuter(95);
            } else {
                setAutoInner(45);
                setAutoOuter(120);
            }
        };

        updateRadius();
        window.addEventListener("resize", updateRadius);
        return () => window.removeEventListener("resize", updateRadius);
    }, []);

    if (!data || data.length === 0) {
        return <div className="p-6 text-center text-gray-400">No data available.</div>;
    }

    const round2 = (num: number) => Number(num.toFixed(2));

    return (
        <div ref={containerRef} className="w-full bg-transparent rounded-xl p-2">
            <h2 className="text-xl font-semibold mb-4 text-white tracking-wide">{title}</h2>

            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>

                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius ?? autoInner}
                        outerRadius={outerRadius ?? autoOuter}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                        // label={({ name, percent = 0 }) =>
                        //     `${name} (${round2(percent * 100)}%)`
                        // }
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {data.map((_, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                    cursor="pointer"
                                    style={{
                                        transform: isActive ? "scale(1.05)" : "scale(1)",
                                        transformOrigin: "center",
                                        transition: "all 0.25s ease-out",
                                        filter: isActive ? "brightness(1.3)" : "brightness(1)",
                                    }}
                                />
                            );
                        })}
                    </Pie>

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1d2430",
                            border: "1px solid #333",
                            borderRadius: "8px",
                        }} formatter={(value: number) => Number(value.toFixed(2))}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#ddd" }}
                    />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;
