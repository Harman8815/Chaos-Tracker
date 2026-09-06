import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/Dialog';
import { Goal, GoalCategory, GoalStatus } from '../../types';
import goalService from '../../services/goalService';
import { Trash2, Ban, Check, X, Eye, EyeOff, Search, Plus, Filter, Calendar, Target, TrendingUp, MoreHorizontal } from 'lucide-react';
import { PieChart, BarChart } from './charts';

const TrashIcon = Trash2;
const BlockIcon = Ban;
const CheckIcon = Check;
const CloseIcon = X;
const EyeIcon = Eye;
const EyeOffIcon = EyeOff;
const SearchIcon = Search;
const PlusIcon = Plus;
const FilterIcon = Filter;
const CalendarIcon = Calendar;
const TargetIcon = Target;
const TrendingUpIcon = TrendingUp;
const MoreIcon = MoreHorizontal;

const GoalDashboard: React.FC<{ goals: Goal[]; onClose: () => void }> = ({ goals, onClose }) => {
    const stats = useMemo(() => {
        const completed = goals.filter(g => g.status === 'completed');
        const active = goals.filter(g => g.status === 'active');

        const completionRate = (active.length + completed.length) > 0
            ? (completed.length / (active.length + completed.length)) * 100
            : 0;

        const completedWithDates = completed.filter(g => g.completed_at && g.created_at);
        const totalCompletionTime = completedWithDates.reduce((sum, g) => {
            const start = new Date(g.created_at!).getTime();
            const end = new Date(g.completed_at!).getTime();
            return sum + (end - start);
        }, 0);
        const avgCompletionTime = completedWithDates.length > 0
            ? (totalCompletionTime / completedWithDates.length) / (1000 * 60 * 60 * 24) // in days
            : 0;

        return {
            completed: completed.length,
            active: active.length,
            trashed: goals.filter(g => g.status === 'trashed').length,
            blocked: goals.filter(g => g.status === 'blocked').length,
            completionRate,
            avgCompletionTime
        };
    }, [goals]);

    const weeklyCompletion = useMemo((): { label: string; value: number; }[] => {
        const getWeekLabel = (d: Date) => {
            const firstDay = new Date(d.setDate(d.getDate() - d.getDay()));
            return `${firstDay.getMonth() + 1}/${firstDay.getDate()}`;
        }
        const completedGoals = goals.filter(g => g.status === 'completed' && g.completed_at);
        const weeklyData: { [week: string]: number } = {};
        completedGoals.forEach(g => {
            const week = getWeekLabel(new Date(g.completed_at!));
            weeklyData[week] = (weeklyData[week] || 0) + 1;
        });
        return Object.entries(weeklyData).slice(-5).map(([label, value]) => ({ label, value }));
    }, [goals]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Goals Dashboard</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/[0.08]"><CloseIcon /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-white">{stats.completed}</div><div className="text-sm text-text-secondary">Completed</div></CardContent></Card>
                    <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-white">{stats.active}</div><div className="text-sm text-text-secondary">Active</div></CardContent></Card>
                    <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-white">{stats.blocked}</div><div className="text-sm text-text-secondary">Blocked</div></CardContent></Card>
                    <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-white">{stats.trashed}</div><div className="text-sm text-text-secondary">Trashed</div></CardContent></Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Goal Status Breakdown</h3>
                        <PieChart
                            data={[
                                { name: 'Completed', value: stats.completed },
                                { name: 'Active', value: stats.active },
                                { name: 'Blocked', value: stats.blocked },
                                { name: 'Trashed', value: stats.trashed },
                            ]}
                            colors={['var(--color-success)', 'var(--color-info)', 'var(--color-warning)', 'var(--color-error)']}
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
                        <div className="text-5xl font-bold text-success">{stats.completionRate.toFixed(1)}<span className="text-2xl">%</span></div>
                        <p className="text-sm text-text-secondary mt-1">Of active & completed goals</p>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Insights</h3>
                        <ul className="text-sm space-y-2 text-text-secondary list-disc list-inside">
                            <li>Total goals tracked: <span className="font-bold text-white">{goals.length}</span></li>
                            <li>Active goals needing attention: <span className="font-bold text-white">{stats.active}</span></li>
                            <li>Average time to complete a goal: <span className="font-bold text-white">{stats.avgCompletionTime.toFixed(1)} days</span></li>
                            <li>Recent weekly completions trend: <span className="font-bold text-white">{weeklyCompletion.map(d => d.value).join(', ')}</span></li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const GoalCard: React.FC<{ goal: Goal; onToggle: (id: number) => void; onUpdateStatus: (id: number, status: GoalStatus) => void; onDelete: (id: number) => void; }> = ({ goal, onToggle, onUpdateStatus, onDelete }) => {
    const statusColors = {
        active: 'border-accent-primary/30',
        completed: 'border-success/30',
        blocked: 'border-warning/30',
        trashed: 'border-error/30'
    };

    return (
        <div className={`p-4 rounded-xl border ${statusColors[goal.status]} bg-white/[0.03] backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.05] hover:border-white/20 group`}>
            <div className="flex items-start gap-3">
                <button 
                    onClick={() => onToggle(goal.id)} 
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${goal.status === 'completed' ? 'bg-accent-primary border-accent-primary' : 'border-white/20 hover:border-accent-primary'}`}
                >
                    {goal.status === 'completed' && <CheckIcon className="text-white w-3 h-3" />}
                </button>
                <div className="flex-grow min-w-0">
                    <p className={`text-white font-medium ${goal.status === 'completed' ? 'line-through text-text-tertiary' : ''} ${goal.status === 'blocked' || goal.status === 'trashed' ? 'text-text-tertiary' : ''}`}>
                        {goal.text}
                    </p>
                    {goal.tags && goal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {goal.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-text-secondary border border-white/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {goal.status !== 'completed' && (
                        <button onClick={() => onUpdateStatus(goal.id, 'blocked')} title="Block" className="p-1.5 rounded-lg hover:bg-white/[0.08] text-text-secondary hover:text-warning transition-colors">
                            <BlockIcon className="w-4 h-4" />
                        </button>
                    )}
                    <button onClick={() => onDelete(goal.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-white/[0.08] text-text-secondary hover:text-error transition-colors">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const GoalMasonryCard: React.FC<{ goal: Goal; onToggle: (id: number) => void; onUpdateStatus: (id: number, status: GoalStatus) => void; onDelete: (id: number) => void; }> = ({ goal, onToggle, onUpdateStatus, onDelete }) => {
    const progress = goal.target > 0 ? Math.round((goal.completed_tasks / goal.target) * 100) : 0;
    const statusColors = {
        active: 'border-accent-primary/30',
        completed: 'border-success/30',
        blocked: 'border-warning/30',
        trashed: 'border-error/30'
    };
    const statusBg = {
        active: 'bg-accent-primary/10',
        completed: 'bg-success/10',
        blocked: 'bg-warning/10',
        trashed: 'bg-error/10'
    };

    return (
        <div className={`p-4 rounded-xl border ${statusColors[goal.status]} bg-white/[0.03] backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.05] hover:border-white/20 group break-inside-avoid`}>
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-grow min-w-0">
                    <button 
                        onClick={() => onToggle(goal.id)} 
                        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${goal.status === 'completed' ? 'bg-accent-primary border-accent-primary' : 'border-white/20 hover:border-accent-primary'}`}
                    >
                        {goal.status === 'completed' && <Check className="text-white w-2.5 h-2.5" />}
                    </button>
                    <p className={`text-white font-medium text-sm truncate ${goal.status === 'completed' ? 'line-through text-text-tertiary' : ''} ${goal.status === 'blocked' || goal.status === 'trashed' ? 'text-text-tertiary' : ''}`}>
                        {goal.text}
                    </p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize flex-shrink-0 ${statusBg[goal.status]} ${statusColors[goal.status].replace('/30', '')}`}>
                    {goal.status}
                </span>
            </div>
            
            <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-secondary">Progress</span>
                    <span className="text-text-secondary">{goal.completed_tasks}/{goal.target}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div 
                        className="h-full rounded-full bg-accent-primary transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.06]">
                <span className="text-[11px] text-text-secondary">
                    {goal.completed_tasks} {goal.completed_tasks === 1 ? 'task' : 'tasks'} completed
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {goal.status !== 'completed' && (
                        <button onClick={() => onUpdateStatus(goal.id, 'blocked')} title="Block" className="p-1 rounded hover:bg-white/[0.08] text-text-secondary hover:text-warning transition-colors">
                            <Ban className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <button onClick={() => onDelete(goal.id)} title="Delete" className="p-1 rounded hover:bg-white/[0.08] text-text-secondary hover:text-error transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const GoalTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'goals')!;
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<GoalCategory>('daily');
    const [showDashboard, setShowDashboard] = useState(false);
    const [showCompleted, setShowCompleted] = useState(true);
    const [newGoalText, setNewGoalText] = useState('');
    const [newGoalTags, setNewGoalTags] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showAllGoals, setShowAllGoals] = useState(false);

    const isFutureTab = activeTab === 'future';

    const fetchGoals = useCallback(async () => {
        try {
            setLoading(true);
            const response = await goalService.getAllGoals();
            setGoals(response.goals || []);
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim() === '') return;
        const tags = newGoalTags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);

        try {
            await goalService.createGoal({
                text: newGoalText.trim(),
                category: activeTab,
                tags: tags.length > 0 ? tags : undefined,
            });
            await fetchGoals();
            setNewGoalText('');
            setNewGoalTags('');
        } catch (error) {
            console.error('Error creating goal:', error);
        }
    };

    const handleToggleGoal = async (id: number) => {
        const goal = goals.find(g => g.id === id);
        if (!goal) return;

        const newStatus = goal.status === 'completed' ? 'active' : 'completed';
        try {
            await goalService.updateGoal(id, { status: newStatus });
            await fetchGoals();
        } catch (error) {
            console.error('Error toggling goal:', error);
        }
    };

    const handleUpdateStatus = async (id: number, status: GoalStatus) => {
        try {
            await goalService.updateGoal(id, { status });
            await fetchGoals();
        } catch (error) {
            console.error('Error updating goal status:', error);
        }
    };

    const handleDeleteGoal = async (id: number) => {
        if (!confirm('Are you sure you want to delete this goal?')) return;
        try {
            await goalService.deleteGoal(id);
            await fetchGoals();
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const filteredGoals = useMemo(() => {
        let result = goals.filter(g => g.status !== 'trashed');

        // Filter by active tab/category
        if (selectedCategory !== 'all') {
            result = result.filter(g => g.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(g => 
                g.text.toLowerCase().includes(query) ||
                g.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Group by tags
        const groups: Record<string, Goal[]> = {};
        result.forEach(goal => {
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
    }, [goals, selectedCategory, searchQuery]);

    const visibleGoals = useMemo(() => {
        let result = goals.filter(g => g.status !== 'trashed' && g.category === activeTab);
        if (!showCompleted) {
            result = result.filter(g => g.status !== 'completed');
        }
        return result;
    }, [goals, activeTab, showCompleted]);

    if (loading && goals.length === 0) {
        return (
            <TrackerWrapper tracker={trackerInfo}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-text-secondary">Loading goals...</div>
                </div>
            </TrackerWrapper>
        );
    }

    return (
        <TrackerWrapper tracker={trackerInfo}>
            {showDashboard && <GoalDashboard goals={goals} onClose={() => setShowDashboard(false)} />}

            {/* Header with title and dashboard button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <TargetIcon className="w-8 h-8 text-accent-primary" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Goals</h2>
                        <p className="text-sm text-text-secondary">Track and manage your objectives</p>
                    </div>
                </div>
                <Button onClick={() => setShowDashboard(true)} className="flex items-center gap-2">
                    <TrendingUpIcon className="w-4 h-4" />
                    Dashboard
                </Button>
            </div>

            {/* Search and Filter Bar */}
            <Card className="mb-6 glass">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search goals by name or tag..."
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-4 h-4 text-text-secondary" />
                        <Select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="future">Future</option>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Category Tabs */}
            <div className="flex border-b border-white/10 mb-6">
                {(['daily', 'monthly', 'future'] as GoalCategory[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                            activeTab === tab 
                                ? 'text-white' 
                                : 'text-text-secondary hover:text-white'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} Goals
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Create New Goal Container */}
            <Card className="mb-6 glass">
                <form onSubmit={handleAddGoal} className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <PlusIcon className="w-5 h-5 text-accent-primary" />
                        <h3 className="text-lg font-semibold text-white">Create New Goal</h3>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <Input
                            type="text"
                            value={newGoalText}
                            onChange={e => setNewGoalText(e.target.value)}
                            placeholder={`What's your ${activeTab} goal?`}
                            className="flex-grow"
                            required
                        />
                        <Input
                            type="text"
                            value={newGoalTags}
                            onChange={e => setNewGoalTags(e.target.value)}
                            placeholder="Tags (comma-separated)"
                            className="md:w-64"
                        />
                        <Button type="submit" className="flex items-center gap-2">
                            <PlusIcon className="w-4 h-4" />
                            Add Goal
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Goals List */}
            {visibleGoals.length > 0 ? (
                <>
                    <Masonry
                        breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                        className="flex -mx-3"
                        columnClassName="px-3"
                    >
                        {visibleGoals.slice(0, 5).map((goal, index) => (
                            <div key={goal.id} className="mb-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <GoalMasonryCard
                                    goal={goal}
                                    onToggle={handleToggleGoal}
                                    onUpdateStatus={handleUpdateStatus}
                                    onDelete={handleDeleteGoal}
                                />
                            </div>
                        ))}
                    </Masonry>
                    {visibleGoals.length > 5 && (
                        <div className="flex justify-center mt-6">
                            <Button onClick={() => setShowAllGoals(true)} variant="outline" className="flex items-center gap-2">
                                <MoreIcon className="w-4 h-4" />
                                Show More ({visibleGoals.length - 5} more)
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <Card className="glass text-center py-12">
                    <TargetIcon className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
                    <p className="text-text-secondary text-lg">
                        {searchQuery || selectedCategory !== 'all' 
                            ? 'No goals match your search criteria.' 
                            : 'No goals yet. Create your first goal above!'}
                    </p>
                </Card>
            )}

            {/* Show All Goals Modal */}
            <Dialog open={showAllGoals} onOpenChange={setShowAllGoals}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>All Goals</DialogTitle>
                    </DialogHeader>
                    <DialogClose />
                    <Masonry
                        breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                        className="flex -mx-3"
                        columnClassName="px-3"
                    >
                        {visibleGoals.map((goal, index) => (
                            <div key={goal.id} className="mb-4">
                                <GoalMasonryCard
                                    goal={goal}
                                    onToggle={handleToggleGoal}
                                    onUpdateStatus={handleUpdateStatus}
                                    onDelete={handleDeleteGoal}
                                />
                            </div>
                        ))}
                    </Masonry>
                </DialogContent>
            </Dialog>
        </TrackerWrapper>
    );
};

export default GoalTracker;

