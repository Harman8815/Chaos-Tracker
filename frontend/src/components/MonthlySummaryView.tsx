import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { client } from '../api/client';

interface MonthlyAnalytics {
    period: string;
    month: string;
    journal: {
        entries_count: number;
        recent_entries: Array<{
            date: string;
            content_preview: string;
        }>;
    };
    expenses: {
        total_amount: number;
        transaction_count: number;
        by_category: Record<string, number>;
        recent_expenses: Array<{
            date: string;
            amount: number;
            category: string;
            description: string;
        }>;
    };
    goals: {
        total_goals: number;
        active_goals: number;
        completed_goals: number;
        completion_rate: number;
    };
    habits: {
        performance: Record<string, {
            total_score: number;
            days_tracked: number;
            average_score: number;
        }>;
        total_days_tracked: number;
    };
}

const MonthlySummaryView: React.FC = () => {
    const [analytics, setAnalytics] = useState<MonthlyAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMonthlyAnalytics();
    }, []);

    const fetchMonthlyAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get<MonthlyAnalytics>('/analytics/monthly/');
            setAnalytics(response);
        } catch (err) {
            setError('Failed to fetch monthly analytics');
            console.error('Error fetching monthly analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getProgressBarColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 60) return 'bg-yellow-500';
        if (percentage >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5cf6]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={fetchMonthlyAnalytics}>Retry</Button>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return null;
    }

    return (
        <div className="p-6 h-full overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Monthly Summary</h1>
                <Button onClick={fetchMonthlyAnalytics} className="bg-[rgba(15,10,30,0.6)] text-white hover:bg-border">
                    Refresh
                </Button>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                    {analytics.month}
                </h2>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <div className="text-center">
                        <h3 className="text-sm text-[#e9d5ff] mb-1">Journal Entries</h3>
                        <p className="text-2xl font-bold text-white">
                            {analytics.journal.entries_count}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <h3 className="text-sm text-[#e9d5ff] mb-1">Total Expenses</h3>
                        <p className="text-2xl font-bold text-white">
                            {formatCurrency(analytics.expenses.total_amount)}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <h3 className="text-sm text-[#e9d5ff] mb-1">Active Goals</h3>
                        <p className="text-2xl font-bold text-white">
                            {analytics.goals.active_goals}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <h3 className="text-sm text-[#e9d5ff] mb-1">Days Tracked</h3>
                        <p className="text-2xl font-bold text-white">
                            {analytics.habits.total_days_tracked}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Goals Progress */}
            <Card className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Goals Progress</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#e9d5ff]">Completion Rate</span>
                            <span className="text-white font-medium">
                                {analytics.goals.completion_rate.toFixed(1)}%
                            </span>
                        </div>
                        <div className="w-full bg-[rgba(15,10,30,0.6)] rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${getProgressBarColor(analytics.goals.completion_rate)}`}
                                style={{ width: `${analytics.goals.completion_rate}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {analytics.goals.total_goals}
                            </p>
                            <p className="text-xs text-[#e9d5ff]">Total</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-500">
                                {analytics.goals.active_goals}
                            </p>
                            <p className="text-xs text-[#e9d5ff]">Active</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-500">
                                {analytics.goals.completed_goals}
                            </p>
                            <p className="text-xs text-[#e9d5ff]">Completed</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Expenses by Category */}
            <Card className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Expenses by Category</h3>
                <div className="space-y-3">
                    {Object.entries(analytics.expenses.by_category).map(([category, amount]) => (
                        <div key={category} className="flex justify-between items-center">
                            <span className="text-white capitalize">{category}</span>
                            <span className="text-white font-medium">
                                {formatCurrency(amount)}
                            </span>
                        </div>
                    ))}
                    {Object.keys(analytics.expenses.by_category).length === 0 && (
                        <p className="text-[#e9d5ff] text-center py-4">
                            No expenses this month
                        </p>
                    )}
                </div>
            </Card>

            {/* Habit Performance */}
            <Card className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Habit Performance</h3>
                <div className="space-y-4">
                    {Object.entries(analytics.habits.performance).map(([habit, performance]) => (
                        <div key={habit} className="border-b border-[rgba(139,92,246,0.35)] pb-3 last:border-0">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-medium capitalize">
                                    {habit}
                                </span>
                                <span className="text-sm text-[#e9d5ff]">
                                    {performance.days_tracked} days tracked
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[#e9d5ff]">
                                    Avg Score: {performance.average_score.toFixed(1)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#e9d5ff]">
                                        Total: {performance.total_score}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {Object.keys(analytics.habits.performance).length === 0 && (
                        <p className="text-[#e9d5ff] text-center py-4">
                            No habits tracked this month
                        </p>
                    )}
                </div>
            </Card>

            {/* Recent Journal Entries */}
            <Card className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Journal Entries</h3>
                <div className="space-y-3">
                    {analytics.journal.recent_entries.map((entry, index) => (
                        <div key={index} className="border-b border-[rgba(139,92,246,0.35)] pb-3 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm text-[#e9d5ff]">
                                    {entry.date}
                                </span>
                            </div>
                            <p className="text-white text-sm">
                                {entry.content_preview}
                            </p>
                        </div>
                    ))}
                    {analytics.journal.recent_entries.length === 0 && (
                        <p className="text-[#e9d5ff] text-center py-4">
                            No journal entries this month
                        </p>
                    )}
                </div>
            </Card>

            {/* Recent Expenses */}
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Expenses</h3>
                <div className="space-y-3">
                    {analytics.expenses.recent_expenses.map((expense, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-[rgba(139,92,246,0.35)] pb-3 last:border-0">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs px-2 py-1 bg-[rgba(15,10,30,0.6)] rounded text-[#e9d5ff] capitalize">
                                        {expense.category}
                                    </span>
                                    <span className="text-sm text-[#e9d5ff]">
                                        {expense.date}
                                    </span>
                                </div>
                                {expense.description && (
                                    <p className="text-white text-sm">
                                        {expense.description}
                                    </p>
                                )}
                            </div>
                            <span className="text-white font-medium">
                                {formatCurrency(expense.amount)}
                            </span>
                        </div>
                    ))}
                    {analytics.expenses.recent_expenses.length === 0 && (
                        <p className="text-[#e9d5ff] text-center py-4">
                            No expenses this month
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default MonthlySummaryView;