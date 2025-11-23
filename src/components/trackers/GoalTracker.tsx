import React, { useState, useMemo, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Goal, GoalData, GoalCategory, GoalStatus } from '../../types';
import { DataContext } from '../../context/DataContext';

// --- SVG Icons ---
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const BlockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

// --- Sub-components ---

const PieChart: React.FC<{ data: { name: string; value: number }[], colors: string[] }> = ({ data, colors }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">No data to display.</div>;
    
    let startAngle = -90;
    return (
        <div className="flex items-center justify-center gap-6">
            <svg width="150" height="150" viewBox="0 0 150 150">
                {data.map((slice, i) => {
                    const angle = (slice.value / total) * 360;
                    const endAngle = startAngle + angle;
                    const x1 = 75 + 75 * Math.cos(startAngle * Math.PI / 180);
                    const y1 = 75 + 75 * Math.sin(startAngle * Math.PI / 180);
                    const x2 = 75 + 75 * Math.cos(endAngle * Math.PI / 180);
                    const y2 = 75 + 75 * Math.sin(endAngle * Math.PI / 180);
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const pathData = `M 75,75 L ${x1},${y1} A 75,75 0 ${largeArcFlag},1 ${x2},${y2} Z`;
                    startAngle = endAngle;
                    return <path key={slice.name} d={pathData} fill={colors[i % colors.length]} />;
                })}
            </svg>
            <div className="flex flex-col space-y-1">
                {data.map((slice, i) => (
                    <div key={slice.name} className="flex items-center text-sm">
                        <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colors[i % colors.length] }} />
                        <span>{slice.name} ({((slice.value / total) * 100).toFixed(0)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BarChart: React.FC<{ data: { label: string; value: number }[], color: string }> = ({ data, color }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="flex justify-around items-end h-48 w-full gap-4 px-2">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center justify-end h-full w-full">
                    <div className="text-sm font-bold">{item.value}</div>
                    <div 
                        className="w-full rounded-t-md" 
                        style={{ height: `${(item.value / maxValue) * 80}%`, backgroundColor: color }}
                    />
                    <div className="text-xs text-text-secondary mt-1">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const GoalDashboard: React.FC<{ goals: GoalData; onClose: () => void }> = ({ goals, onClose }) => {
    const allGoals = useMemo(() => [...goals.daily, ...goals.monthly, ...goals.future], [goals]);

    const stats = useMemo(() => {
        const completed = allGoals.filter(g => g.status === 'completed');
        const active = allGoals.filter(g => g.status === 'active');
        
        const completionRate = (active.length + completed.length) > 0 
            ? (completed.length / (active.length + completed.length)) * 100 
            : 0;

        const completedWithDates = completed.filter(g => g.completedAt && g.createdAt);
        const totalCompletionTime = completedWithDates.reduce((sum, g) => {
            const start = new Date(g.createdAt!).getTime();
            const end = new Date(g.completedAt!).getTime();
            return sum + (end - start);
        }, 0);
        const avgCompletionTime = completedWithDates.length > 0
            ? (totalCompletionTime / completedWithDates.length) / (1000 * 60 * 60 * 24) // in days
            : 0;
            
        return {
            completed: completed.length,
            active: active.length,
            trashed: allGoals.filter(g => g.status === 'trashed').length,
            blocked: allGoals.filter(g => g.status === 'blocked').length,
            completionRate,
            avgCompletionTime
        };
    }, [allGoals]);
    
    // FIX: Explicitly typing weeklyCompletion to avoid 'unknown' type error.
    const weeklyCompletion = useMemo((): { label: string; value: number; }[] => {
        const getWeekLabel = (d: Date) => {
            const firstDay = new Date(d.setDate(d.getDate() - d.getDay()));
            return `${firstDay.getMonth()+1}/${firstDay.getDate()}`;
        }
        const completedGoals = allGoals.filter(g => g.status === 'completed' && g.completedAt);
        const weeklyData: {[week: string]: number} = {};
        completedGoals.forEach(g => {
            const week = getWeekLabel(new Date(g.completedAt!));
            weeklyData[week] = (weeklyData[week] || 0) + 1;
        });
        return Object.entries(weeklyData).slice(-5).map(([label, value]) => ({ label, value }));
    }, [allGoals]);

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Goals Dashboard</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-input-bg"><CloseIcon/></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card><div className="text-2xl font-bold">{stats.completed}</div><div className="text-sm text-text-secondary">Completed</div></Card>
                    <Card><div className="text-2xl font-bold">{stats.active}</div><div className="text-sm text-text-secondary">Active</div></Card>
                    <Card><div className="text-2xl font-bold">{stats.blocked}</div><div className="text-sm text-text-secondary">Blocked</div></Card>
                    <Card><div className="text-2xl font-bold">{stats.trashed}</div><div className="text-sm text-text-secondary">Trashed</div></Card>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Goal Status Breakdown</h3>
                        <PieChart 
                            data={[
                                {name: 'Completed', value: stats.completed},
                                {name: 'Active', value: stats.active},
                                {name: 'Blocked', value: stats.blocked},
                                {name: 'Trashed', value: stats.trashed},
                            ]} 
                            colors={['#34d399', '#60a5fa', '#f59e0b', '#ef4444']} 
                        />
                    </Card>
                     <Card>
                        <h3 className="text-xl font-bold mb-4">Weekly Completions</h3>
                        <BarChart data={weeklyCompletion} color="var(--color-accent-primary)" />
                    </Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="flex flex-col justify-center items-center">
                         <h3 className="text-xl font-bold mb-2">Completion Rate</h3>
                         <div className="text-5xl font-bold text-green-400">{stats.completionRate.toFixed(1)}<span className="text-2xl">%</span></div>
                         <p className="text-sm text-text-secondary mt-1">Of active & completed goals</p>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Insights & Debug</h3>
                        <ul className="text-sm space-y-2 text-text-secondary list-disc list-inside">
                            <li>Total goals tracked: <span className="font-bold text-text-primary">{allGoals.length}</span></li>
                            <li>Active goals needing attention: <span className="font-bold text-text-primary">{stats.active}</span></li>
                            <li>Average time to complete a goal: <span className="font-bold text-text-primary">{stats.avgCompletionTime.toFixed(1)} days</span></li>
                            <li>Recent weekly completions trend: <span className="font-bold text-text-primary">{weeklyCompletion.map(d => d.value).join(', ')}</span></li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const GoalItem: React.FC<{ goal: Goal; onToggle: (id: string) => void; onUpdateStatus: (id: string, status: GoalStatus) => void; }> = ({ goal, onToggle, onUpdateStatus }) => {
    return (
        <div className="flex items-center p-3 rounded-lg hover:bg-input-bg/50 group">
            <button onClick={() => onToggle(goal.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all flex-shrink-0 ${goal.status === 'completed' ? 'bg-accent-primary border-accent-primary' : 'border-border'}`}>
                {goal.status === 'completed' && <CheckIcon className="text-white" />}
            </button>
            <span className={`flex-grow text-text-primary ${goal.status === 'completed' ? 'line-through text-text-disabled' : ''} ${goal.status === 'blocked' || goal.status === 'trashed' ? 'text-text-disabled' : ''}`}>
                {goal.text}
            </span>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onUpdateStatus(goal.id, 'blocked')} title="Block" className="p-1 text-text-secondary hover:text-yellow-500"><BlockIcon/></button>
                <button onClick={() => onUpdateStatus(goal.id, 'trashed')} title="Trash" className="p-1 text-text-secondary hover:text-red-500"><TrashIcon/></button>
            </div>
        </div>
    );
};

// --- Main Component ---

const GoalTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'goals')!;
    const { goals, setGoals } = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<GoalCategory>('daily');
    const [showDashboard, setShowDashboard] = useState(false);
    const [showCompleted, setShowCompleted] = useState(true);
    const [newGoalText, setNewGoalText] = useState('');
    const [newGoalTags, setNewGoalTags] = useState('');

    const isFutureTab = activeTab === 'future';

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim() === '') return;
        const tags = newGoalTags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
        const newGoal: Goal = {
            id: uuidv4(),
            text: newGoalText.trim(),
            status: 'active',
            createdAt: new Date().toISOString(),
            tags: tags.length > 0 ? tags : undefined,
        };
        setGoals(prev => ({
            ...prev,
            [activeTab]: [...prev[activeTab], newGoal]
        }));
        setNewGoalText('');
        setNewGoalTags('');
    };

    const handleToggleGoal = (id: string) => {
        setGoals(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(g => 
                g.id === id ? { 
                    ...g, 
                    status: g.status === 'completed' ? 'active' : 'completed',
                    completedAt: g.status !== 'completed' ? new Date().toISOString() : undefined
                } : g
            )
        }));
    };
    
    const handleUpdateStatus = (id: string, status: GoalStatus) => {
        setGoals(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(g => g.id === id ? { ...g, status } : g)
        }));
    };

    const visibleGoals = useMemo(() => {
        const filteredByStatus = goals[activeTab].filter(g => g.status !== 'trashed');
        if (showCompleted) {
            return filteredByStatus;
        }
        return filteredByStatus.filter(g => g.status !== 'completed');
    }, [goals, activeTab, showCompleted]);

    // FIX: Explicitly type `groupedGoals` to fix type inference issues with `Object.entries`.
    const groupedGoals: Record<string, Goal[]> = useMemo(() => {
        const groups: Record<string, Goal[]> = {};
        visibleGoals.forEach(goal => {
            const goalTags = goal.tags && goal.tags.length > 0 ? goal.tags : ['uncategorized'];
            goalTags.forEach(tag => {
                const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
                if (!groups[capitalizedTag]) {
                    groups[capitalizedTag] = [];
                }
                groups[capitalizedTag].push(goal);
            });
        });
        return groups;
    }, [visibleGoals]);

    return (
        <TrackerWrapper tracker={trackerInfo}>
            {showDashboard && <GoalDashboard goals={goals} onClose={() => setShowDashboard(false)} />}
            
            <div className="flex justify-center mb-6 relative">
                <div className="flex border-b border-border">
                    {(['daily', 'monthly', 'future'] as GoalCategory[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-semibold transition-colors capitalize ${activeTab === tab ? 'border-b-2 border-accent-primary text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            {tab} Goals
                        </button>
                    ))}
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <Button onClick={() => setShowDashboard(true)}>Dashboard</Button>
                </div>
            </div>

            <div className="max-h-[calc(100vh-12rem)] flex flex-col">
                 <form onSubmit={handleAddGoal} className="flex flex-col md:flex-row gap-2 mb-4">
                    <input
                        type="text"
                        value={newGoalText}
                        onChange={e => setNewGoalText(e.target.value)}
                        placeholder={`Add a new ${activeTab} goal...`}
                        className="flex-grow p-3 rounded-md bg-input-bg border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                    <input
                        type="text"
                        value={newGoalTags}
                        onChange={e => setNewGoalTags(e.target.value)}
                        placeholder="Tags (comma-separated)"
                        className="md:w-1/3 p-3 rounded-md bg-input-bg border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                    <Button type="submit" className="px-6">Add Goal</Button>
                </form>

                <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
                    <h3 className="text-xl font-bold capitalize">{activeTab} Goals</h3>
                    <button onClick={() => setShowCompleted(p => !p)} className="p-2 rounded-full hover:bg-input-bg text-text-secondary flex items-center gap-2 text-sm" title={showCompleted ? 'Hide completed' : 'Show completed'}>
                        {showCompleted ? <EyeIcon /> : <EyeOffIcon />}
                        <span>{showCompleted ? 'Showing' : 'Hiding'} Completed</span>
                    </button>
                </div>

                <div className={`overflow-y-auto -mr-3 pr-3 ${isFutureTab ? 'columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6' : 'space-y-6'}`}>
                    {Object.keys(groupedGoals).length > 0 ? Object.entries(groupedGoals).map(([tag, goalsInGroup], index) => (
                        <Card 
                            key={tag} 
                            className={`animate-fade-in w-full ${isFutureTab ? 'break-inside-avoid' : ''}`}
                            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                        >
                            <h4 className="font-bold text-lg mb-2 text-accent-primary">{tag}</h4>
                            <div className="space-y-1 divide-y divide-border/50">
                                {goalsInGroup.map(goal => (
                                    <GoalItem key={goal.id} goal={goal} onToggle={handleToggleGoal} onUpdateStatus={handleUpdateStatus} />
                                ))}
                            </div>
                        </Card>
                    )) : <p className="text-text-secondary text-center py-8">No goals yet. Add one!</p>}
                </div>
            </div>
        </TrackerWrapper>
    );
};

export default GoalTracker;
