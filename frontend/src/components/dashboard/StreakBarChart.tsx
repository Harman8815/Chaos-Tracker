import React, { useState } from 'react';

const StreakBarChart: React.FC<{ data: { name: string, streak: number }[] }> = ({ data }) => {
    const [expanded, setExpanded] = useState(false);

    if (data.length === 0) return <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">Not enough data to display.</div>;

    const maxStreak = Math.max(...data.map(d => d.streak), 1);
    const displayData = expanded ? data : data.slice(0, 5);

    return (
        <div className="space-y-4">
            <div className={`space-y-4 transition-all duration-300 ease-in-out`}>
                {displayData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 text-sm">
                        <span className="w-24 truncate text-right text-text-secondary" title={item.name}>{item.name}</span>
                        <div className="flex-grow bg-white/[0.06] rounded-full h-3 relative overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-accent-primary to-accent-primary-hover h-full rounded-full absolute top-0 left-0 transition-all duration-500"
                                style={{ width: `${(item.streak / maxStreak) * 100}%` }}
                            />
                        </div>
                        <span className="w-8 font-bold text-right text-white">{item.streak}</span>
                    </div>
                ))}
            </div>

            {data.length > 5 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full text-xs text-center text-accent-primary hover:text-accent-primary-hover pt-2 border-t border-white/10 border-dashed transition-colors focus:outline-none uppercase font-bold tracking-wide"
                >
                    {expanded ? 'Show Less' : `+ ${data.length - 5} More`}
                </button>
            )}
        </div>
    );
};

export { StreakBarChart };

