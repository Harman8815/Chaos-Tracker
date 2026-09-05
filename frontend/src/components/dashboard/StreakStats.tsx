const StreakStats: React.FC<{ streaks: { name: string, streak: number }[] }> = ({ streaks }) => {
    const active = streaks.filter(s => s.streak > 0).length;
    const total = streaks.length;
    const best = streaks.length > 0 ? Math.max(...streaks.map(s => s.streak)) : 0;
    const avg = streaks.length > 0 ? streaks.reduce((acc, curr) => acc + curr.streak, 0) / total : 0;

    return (
        <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white/[0.04] rounded-lg border border-white/10">
                <div className="text-lg font-bold text-accent-primary">{active}/{total}</div>
                <div className="text-[10px] uppercase tracking-wider text-text-secondary">Active</div>
            </div>
            <div className="p-2 bg-white/[0.04] rounded-lg border border-white/10">
                <div className="text-lg font-bold text-success">{best}</div>
                <div className="text-[10px] uppercase tracking-wider text-text-secondary">Best Streak</div>
            </div>
            <div className="p-2 bg-white/[0.04] rounded-lg border border-white/10">
                <div className="text-lg font-bold text-info">{avg.toFixed(1)}</div>
                <div className="text-[10px] uppercase tracking-wider text-text-secondary">Avg Streak</div>
            </div>
        </div>
    );
};

export { StreakStats };
