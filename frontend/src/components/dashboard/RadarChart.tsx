import React, { useState } from 'react';

const RadarChart: React.FC<{ data: { axis: string; value: number }[] }> = ({ data }) => {
    const [hoveredPoint, setHoveredPoint] = useState<{ axis: string, value: number, x: number, y: number } | null>(null);

    if (!data || data.length < 3) return <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">Not enough data to display.</div>;

    const size = 600;
    const center = size / 2;
    const radius = size * 0.35;
    const levels = 5;
    const maxValue = 10;
    const angleSlice = (Math.PI * 2) / data.length;

    const getPoint = (angle: number, value: number) => ({
        x: center + (radius * value / maxValue) * Math.cos(angle - Math.PI / 2),
        y: center + (radius * value / maxValue) * Math.sin(angle - Math.PI / 2),
    });

    const pointsToString = (points: { x: number, y: number }[]) => points.map(p => `${p.x},${p.y}`).join(' ');

    const dataPoints = data.map((d, i) => getPoint(angleSlice * i, d.value));

    return (
        <div className="relative w-full h-full flex items-center justify-center min-h-[500px]">
            <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-4xl" preserveAspectRatio="xMidYMid meet">
                <polygon points={pointsToString(dataPoints)} className="fill-accent-primary/60 stroke-accent-primary" strokeWidth="3" />
                {[...Array(levels)].map((_, levelIndex) => (
                    <polygon
                        key={levelIndex}
                        points={pointsToString(data.map((_, i) => getPoint(angleSlice * i, maxValue * (levels - levelIndex) / levels)))}
                        className="stroke-text-disabled fill-transparent opacity-20"
                        strokeWidth="1"
                    />
                ))}
                {data.map((_, i) => {
                    const p = getPoint(angleSlice * i, maxValue);
                    return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} className="stroke-text-disabled opacity-20" />;
                })}
                {data.map((d, i) => {
                    const p = getPoint(angleSlice * i, maxValue * 1.15);
                    const angleDeg = (angleSlice * i * 180 / Math.PI) - 90;
                    let textAnchor: "middle" | "start" | "end" = "middle";
                    if (angleDeg > 10 && angleDeg < 170) textAnchor = "start";
                    if (angleDeg < -10 && angleDeg > -170) textAnchor = "end";

                    return (
                        <text
                            key={i}
                            x={p.x}
                            y={p.y}
                            textAnchor={textAnchor as any}
                            dy="0.3em"
                            className="text-xs md:text-sm font-semibold fill-text-secondary"
                        >
                            {d.axis}
                        </text>
                    );
                })}
                {dataPoints.map((p, i) => (
                    <circle
                        key={`hover-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r="6"
                        className="fill-card-bg stroke-accent-primary cursor-pointer hover:fill-accent-primary transition-colors"
                        strokeWidth="2"
                        onMouseEnter={() => setHoveredPoint({ ...data[i], x: p.x, y: p.y })}
                        onMouseLeave={() => setHoveredPoint(null)}
                    />
                ))}
            </svg>
            {hoveredPoint && (
                <div
                    className="absolute p-3 bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-lg shadow-xl text-sm pointer-events-none z-20"
                    style={{ left: '50%', top: '50%', transform: `translate(calc(-50% + ${hoveredPoint.x - center}px), calc(-50% + ${hoveredPoint.y - center}px - 50px))` }}
                >
                    <div className="font-bold text-accent-primary text-base mb-1">{hoveredPoint.axis}</div>
                    <div className="text-white font-mono">Avg Score: {hoveredPoint.value.toFixed(2)}</div>
                </div>
            )}
        </div>
    );
};

export { RadarChart };
