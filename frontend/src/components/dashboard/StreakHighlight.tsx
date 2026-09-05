const StreakHighlight: React.FC<{ streaks: { name: string, streak: number }[] }> = ({ streaks }) => {
    const colors = [
        { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '🏆' },
        { bg: 'bg-gray-400/10', text: 'text-gray-300', border: 'border-gray-400/30', icon: '🥈' },
        { bg: 'bg-orange-600/10', text: 'text-orange-500', border: 'border-orange-600/30', icon: '🥉' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {streaks.slice(0, 3).map((s, i) => (
                <div key={s.name} className={`p-5 rounded-xl flex items-center space-x-4 border backdrop-blur-sm ${colors[i].bg} ${colors[i].border}`}>
                    <div className={`text-3xl ${colors[i].text}`}>{colors[i].icon}</div>
                    <div className="min-w-0 flex-1">
                        <div className="text-xs text-text-secondary uppercase tracking-wider font-medium">{i === 0 ? 'Longest' : i === 1 ? '2nd' : '3rd'} Streak</div>
                        <div className="font-bold text-lg truncate text-white">{s.name}</div>
                    </div>
                    <div className={`text-2xl font-bold ${colors[i].text}`}>{s.streak}<span className="text-sm ml-0.5">d</span></div>
                </div>
            ))}
        </div>
    );
};

export { StreakHighlight };
