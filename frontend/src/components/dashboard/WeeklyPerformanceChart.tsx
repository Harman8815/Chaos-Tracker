const WeeklyPerformanceChart: React.FC<{ data: { day: string, score: number }[] }> = ({ data }) => {
    if (data.length === 0) return <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">Not enough data to display.</div>;
    const maxScore = Math.max(...data.map(d => d.score), 1);
    const bestDay = data.reduce((prev, current) => (prev.score > current.score) ? prev : current);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex justify-center items-end flex-grow gap-3 pb-2 h-full w-full px-4">
                {data.map(item => {
                    const isBest = item.day === bestDay.day;
                    return (
                        <div key={item.day} className="flex flex-col items-center justify-end h-full w-full max-w-[40px] group relative">
                            <div className="absolute -top-8 text-xs bg-white/[0.08] backdrop-blur-sm px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-md text-white">
                                {item.score.toFixed(1)} avg
                            </div>
                            <div
                                className={`w-full rounded-t-md transition-all duration-300 ${isBest ? 'bg-warning shadow-[0_0_10px_rgba(234,179,8,0.6)]' : 'bg-accent-primary opacity-90 hover:opacity-100 hover:brightness-110'}`}
                                style={{ height: `${(item.score / maxScore) * 100}%`, minHeight: '4px' }}
                            />
                            <div className={`text-[10px] mt-2 font-medium ${isBest ? 'text-warning font-bold' : 'text-text-secondary'}`}>{item.day}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export { WeeklyPerformanceChart };
