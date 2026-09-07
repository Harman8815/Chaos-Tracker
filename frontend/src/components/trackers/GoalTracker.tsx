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
import { Goal, GoalCategory, GoalStatus, GoalPriority } from '../../types';
import goalService, { CreateGoalPayload as ServiceGoalPayload } from '../../services/goalService';
import CreateGoalModal from '../CreateGoalModal';
import { Trash2, Ban, Check, X, Eye, EyeOff, Search, Plus, Filter, Calendar, Target, TrendingUp, MoreHorizontal, Clock, AlertCircle } from 'lucide-react';
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

const INITIAL_VISIBLE = 5;

const GoalDashboard: React.FC<{ goals: Goal[]; onClose: () => void }> = ({ goals, onClose }) => {
    const stats = useMemo(() => {
        const completed = goals.filter(g => g.status === 'completed');
        const active = goals.filter(g => g.status === 'active');

        const completionRate = (active.length + completed.length) > 0
            ? (completed.length / (active.length + completed.length)) * 100
            : 0;

        const completedWithDates = completed.filter(g => g.completed_at && g.created_at);
        const totalCompletionTime = completedWithDates.reduce((sum, g) => {
            const start = new Date(g.completed_at!).getTime();
            const end = new Date(g.created_at!).getTime();
            return sum + (end - start);
        }, 0);
        const avgCompletionTime = completedWithDates.length > 0
            ? (totalCompletionTime / completedWithDates.length) / (1000 * 60 * 60 * 24)
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

const priorityLabel: Record<GoalPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

const priorityColor: Record<GoalPriority, string> = {
    low: 'text-info',
    medium: 'text-warning',
    high: 'text-error',
};

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

const statusLabel: Record<GoalStatus, string> = {
    active: 'Active',
    completed: 'Completed',
    blocked: 'Blocked',
    trashed: 'Trashed',
};

const categoryLabel: Record<GoalCategory, string> = {
    daily: 'Daily',
    monthly: 'Monthly',
    future: 'Future',
};

interface TaskCardProps {
    goal: Goal;
    onToggle: (id: number) => void;
    onUpdateStatus: (id: number, status: GoalStatus) => void;
    onDelete: (id: number) => void;
    expanded?: boolean;
}

const IndividualTaskCard: React.FC<TaskCardProps> = ({ goal, onToggle, onUpdateStatus, onDelete, expanded }) => {
    const progress = goal.target > 0 ? Math.round((goal.completed_tasks / goal.target) * 100) : 0;
    return (
        <div className={`p-4 rounded-xl border ${statusColors[goal.status]} bg-blue-400/[0.04] backdrop-blur-sm transition-all duration-200 hover:bg-blue-400/[0.07] hover:border-blue-400/30 group break-inside-avoid mb-4`}>
            <div className={`flex items-start justify-between gap-2 mb-2 ${expanded ? 'pb-2 border-b border-white/[0.06]' : ''}`}>
                <div className="flex items-center gap-2 flex-grow min-w-0">
                    <button
                        onClick={() => onToggle(goal.id)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${goal.status === 'completed' ? 'bg-accent-primary border-accent-primary' : 'border-white/20 hover:border-accent-primary'}`}
                    >
                        {goal.status === 'completed' && <Check className="text-white w-2.5 h-2.5" />}
                    </button>
                    <p className={`text-white font-medium text-sm truncate ${goal.status === 'completed' ? 'line-through text-text-tertiary' : ''} ${goal.status === 'blocked' || goal.status === 'trashed' ? 'text-text-tertiary' : ''}`}>
                        {goal.text}
                    </p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize flex-shrink-0 ${statusBg[goal.status]} border ${statusColors[goal.status].replace('/30', '')} border-white/10`}>
                    {statusLabel[goal.status]}
                </span>
            </div>

            {goal.category && (
                <div className="mb-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-text-secondary border border-white/10">
                        {categoryLabel[goal.category]}
                    </span>
                </div>
            )}

            {goal.due_date && (
                <div className="flex items-center gap-1 mb-2">
                    <CalendarIcon className="w-3 h-3 text-text-tertiary" />
                    <span className="text-xs text-text-tertiary">Due: {goal.due_date}</span>
                </div>
            )}

            {goal.priority && (
                <div className="flex items-center gap-1 mb-2">
                    <AlertCircle className="w-3 h-3 text-text-tertiary" />
                    <span className={`text-xs font-medium ${priorityColor[goal.priority]}`}>
                        {priorityLabel[goal.priority]} Priority
                    </span>
                </div>
            )}

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

            {goal.completion_criteria && expanded && (
                <div className="mt-2">
                    <p className="text-xs text-text-tertiary">{goal.completion_criteria}</p>
                </div>
            )}

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

interface CategoryCardProps {
    categoryName: string;
    goals: Goal[];
    onToggle: (id: number) => void;
    onUpdateStatus: (id: number, status: GoalStatus) => void;
    onDelete: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ categoryName, goals, onToggle, onUpdateStatus, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const allGoals = goals.filter(g => g.status !== 'trashed');
    const visibleGoals = expanded ? allGoals : allGoals.slice(0, INITIAL_VISIBLE);
    const hasMore = allGoals.length > INITIAL_VISIBLE;

    return (
        <div className="mb-4 break-inside-avoid">
            <div className="p-4 rounded-xl border border-yellow-400/30 bg-yellow-400/[0.05] backdrop-blur-sm transition-all duration-200 hover:bg-yellow-400/[0.08] group">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-yellow-400/[0.15]">
                    <h3 className="text-lg font-semibold text-white capitalize">{categoryName}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/[0.15] text-yellow-300 border border-yellow-400/30">
                        {allGoals.length} {allGoals.length === 1 ? 'goal' : 'goals'}
                    </span>
                </div>

                <div className="space-y-2">
                    {visibleGoals.map((goal) => (
                        <IndividualTaskCard
                            key={goal.id}
                            goal={goal}
                            onToggle={onToggle}
                            onUpdateStatus={onUpdateStatus}
                            onDelete={onDelete}
                            expanded={false}
                        />
                    ))}
                </div>

                {hasMore && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full mt-2 py-1.5 text-sm text-accent-primary hover:text-white hover:bg-white/[0.06] rounded-md transition-all flex items-center justify-center gap-1"
                    >
                        <MoreIcon className="w-3.5 h-3.5" />
                        {expanded ? 'Show Less' : `Show More (${allGoals.length - INITIAL_VISIBLE} more)`}
                    </button>
                )}
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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                setLoading(true);
                const response = await goalService.getAllGoals();
                setGoals(response.goals || []);
            } catch (error) {
                console.error('Error fetching goals:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    const handleCreateGoal = async (payload: ServiceGoalPayload) => {
        try {
            const servicePayload: ServiceGoalPayload = {
                text: payload.text,
                category: payload.category,
                tags: payload.tags,
                target: payload.target || 1,
                completed_tasks: payload.completed_tasks || 0,
            };

            if (payload.description) servicePayload.description = payload.description;
            if (payload.start_date) servicePayload.start_date = payload.start_date;
            if (payload.due_date) servicePayload.due_date = payload.due_date;
            if (payload.priority) servicePayload.priority = payload.priority;
            if (payload.frequency) servicePayload.frequency = payload.frequency as any;
            if (payload.reminders) servicePayload.reminders = payload.reminders;
            if (payload.completion_criteria) servicePayload.completion_criteria = payload.completion_criteria;
            if (payload.notes) servicePayload.notes = payload.notes;

            await goalService.createGoal(servicePayload);
            const response = await goalService.getAllGoals();
            setGoals(response.goals || []);
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
            setGoals(prev => prev.map(g => g.id === id ? { ...g, status: newStatus as GoalStatus } : g));
        } catch (error) {
            console.error('Error toggling goal:', error);
        }
    };

    const handleUpdateStatus = async (id: number, status: GoalStatus) => {
        try {
            await goalService.updateGoal(id, { status });
            setGoals(prev => prev.map(g => g.id === id ? { ...g, status } : g));
        } catch (error) {
            console.error('Error updating goal status:', error);
        }
    };

    const handleDeleteGoal = async (id: number) => {
        if (!confirm('Are you sure you want to delete this goal?')) return;
        try {
            await goalService.deleteGoal(id);
            setGoals(prev => prev.filter(g => g.id !== id));
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const groupedGoals = useMemo(() => {
        const filtered = goals.filter(g => g.status !== 'trashed' && g.category === activeTab);

        let result = filtered;
        if (selectedCategory !== 'all') {
            result = result.filter(g => (g.tags || []).includes(selectedCategory));
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(g =>
                g.text.toLowerCase().includes(query) ||
                g.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        if (!showCompleted) {
            result = result.filter(g => g.status !== 'completed');
        }

        const categoryGroups: Record<string, Goal[]> = {};
        const untagged: Goal[] = [];

        result.forEach(goal => {
            const tags = goal.tags || [];
            if (tags.length > 0) {
                const categoryKey = tags[0].toLowerCase();
                if (!categoryGroups[categoryKey]) {
                    categoryGroups[categoryKey] = [];
                }
                categoryGroups[categoryKey].push(goal);
            } else {
                untagged.push(goal);
            }
        });

        return { categoryGroups, untagged };
    }, [goals, activeTab, selectedCategory, searchQuery, showCompleted]);

    if (loading && goals.length === 0) {
        return (
            <TrackerWrapper tracker={trackerInfo}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-text-secondary">Loading goals...</div>
                </div>
            </TrackerWrapper>
        );
    }

    const visibleCategories = Object.entries(groupedGoals.categoryGroups);

    return (
        <TrackerWrapper tracker={trackerInfo}>
            {showDashboard && <GoalDashboard goals={goals} onClose={() => setShowDashboard(false)} />}
            <CreateGoalModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateGoal}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <TargetIcon className="w-8 h-8 text-accent-primary" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Goals</h2>
                        <p className="text-sm text-text-secondary">Track and manage your objectives</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => setShowDashboard(true)} className="flex items-center gap-2">
                        <TrendingUpIcon className="w-4 h-4" />
                        Dashboard
                    </Button>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Create Goal
                    </Button>
                </div>
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
                        <button
                            onClick={() => setShowCompleted(!showCompleted)}
                            className={`p-2 rounded-lg transition-colors ${showCompleted ? 'bg-accent-primary/20 text-accent-primary' : 'hover:bg-white/[0.06] text-text-secondary'}`}
                            title={showCompleted ? 'Hide completed' : 'Show completed'}
                        >
                            {showCompleted ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </Card>

            {/* Goal Type Tabs */}
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

            {/* Goals Grid */}
            {loading ? (
                <Card className="glass text-center py-12">
                    <div className="text-text-secondary">Loading goals...</div>
                </Card>
            ) : visibleCategories.length === 0 && groupedGoals.untagged.length === 0 ? (
                <Card className="glass text-center py-12">
                    <TargetIcon className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
                    <p className="text-text-secondary text-lg">
                        {searchQuery || selectedCategory !== 'all'
                            ? 'No goals match your search criteria.'
                            : 'No goals yet. Click "Create Goal" to get started!'}
                    </p>
                </Card>
            ) : (
                <Masonry
                    breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                    className="flex -mx-3"
                    columnClassName="px-3"
                >
                    {/* Category Cards (yellow tint) */}
                    {visibleCategories.map(([categoryName, categoryGoals]) => (
                        <CategoryCard
                            key={categoryName}
                            categoryName={categoryName}
                            goals={categoryGoals}
                            onToggle={handleToggleGoal}
                            onUpdateStatus={handleUpdateStatus}
                            onDelete={handleDeleteGoal}
                        />
                    ))}

                    {/* Individual Task Cards (blue tint) */}
                    {groupedGoals.untagged.map((goal, index) => (
                        <div key={goal.id} className="mb-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <IndividualTaskCard
                                goal={goal}
                                onToggle={handleToggleGoal}
                                onUpdateStatus={handleUpdateStatus}
                                onDelete={handleDeleteGoal}
                                expanded={false}
                            />
                        </div>
                    ))}
                </Masonry>
            )}
        </TrackerWrapper>
    );
};

export default GoalTracker;
