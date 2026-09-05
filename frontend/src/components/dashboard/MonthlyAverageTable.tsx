import React, { useState, useMemo } from 'react';

const MonthlyAverageTable: React.FC<{ data: { name: string, avg: number }[] }> = ({ data }) => {
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'avg'; direction: 'asc' | 'desc' }>({ key: 'avg', direction: 'desc' });

    const sortedData = useMemo(() => {
        const sorted = [...data];
        sorted.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [data, sortConfig]);

    const requestSort = (key: 'name' | 'avg') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (data.length === 0) return <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">Not enough data to display.</div>;

    return (
        <div className="absolute inset-0 flex flex-col">
            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-white/10 pb-2 pr-2 select-none bg-white/[0.04] sticky top-0 z-10">
                 <div 
                    className="col-span-2 cursor-pointer flex items-center hover:text-white transition-colors" 
                    onClick={() => requestSort('name')}
                    title="Sort by Name"
                 >
                    Habit {sortConfig.key === 'name' && <span className="ml-1 text-accent-primary">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                 </div>
                 <div 
                    className="col-span-1 text-right cursor-pointer flex items-center justify-end hover:text-white transition-colors" 
                    onClick={() => requestSort('avg')}
                    title="Sort by Average Score"
                 >
                    Avg {sortConfig.key === 'avg' && <span className="ml-1 text-accent-primary">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
                 </div>
            </div>
            
            <div className="overflow-y-auto flex-grow custom-scrollbar">
                {sortedData.map(item => (
                    <div key={item.name} className="grid grid-cols-3 gap-2 text-sm p-3 hover:bg-white/[0.04] rounded border-b border-white/5 last:border-0 transition-colors">
                        <div className="col-span-2 truncate font-medium text-white" title={item.name}>{item.name}</div>
                        <div className="col-span-1 text-right font-mono text-accent-primary bg-white/[0.04] rounded px-2 py-0.5">{item.avg.toFixed(2)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { MonthlyAverageTable };
