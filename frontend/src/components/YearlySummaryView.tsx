import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { client } from '../api/client';

interface YearlyAnalytics {
    period: string;
    year: number;
    summary: {
        total_journal_entries: number;
        total_expenses: number;
        total_transactions: number;
        goals_created: number;
        average_monthly_expenses: number;
    };
    monthly_breakdown: Array<{
        month: string;
        journal_entries: number;
        expenses_total: number;
        expenses_count: number;
    }>;
    top_expense_categories: Array<{
        category: string;
        amount: number;
    }>;
}

const YearlySummaryView: React.FC = () => {
    const [analytics, setAnalytics] = useState<YearlyAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchYearlyAnalytics();
    }, []);

    const fetchYearlyAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get<YearlyAnalytics>('/analytics/yearly/');
            setAnalytics(response);
        } catch (err) {
            setError('Failed to fetch yearly analytics');
            console.error('Error fetching yearly analytics:', err);
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

    const getMonthColor = (index: number) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
            'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500'
        ];
        return colors[index % colors.length];
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
                    <Button onClick={fetchYearlyAnalytics}>Retry</Button>
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
                <h1 className="text-3xl font-bold text-white">Yearly Summary</h1>
                <Button onClick={fetchYearlyAnalytics} className="bg-[rgba(15,10,30,0.6)] text-white hover:bg-[rgba(139,92,246,0.35)]">
                    Refresh
                </Button>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {analytics.year}
                </h2>
                <p className="text-[#e9d5ff]">Annual Overview</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <Card>
                    <div className="text-center">
                        <h3 className="text-sm text-[#e9d5ff] mb-1">Journal Entries</h3>
                        <p className="text-2xl font-bold text-white">
                            {analytics.summary.total_journal_entries}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <h3 className="text-sm text-[#e9d5ff] mb-1">Total Expenses</h3>
                        <p className="text-2xl font-bold text-white">
                            {formatCurrency(analytics.summary.total_expenses)}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <h3 className="text-sm text-[#e9d5ff] mb-1">Transactions</h3>
                        <p className="text-2xl font-bold text-white">
                            {analytics.summary.total_transactions}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <h3 className="text-sm text-[#e9d5ff] mb-1">Goals Created</h3>
                        <p className="text-2xl font-bold text-white">
                            {analytics.summary.goals_created}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <h3 className="text-sm text-[#e9d5ff] mb-1">Avg Monthly</h3>
                        <p className="text-2xl font-bold text-white">
                            {formatCurrency(analytics.summary.average_monthly_expenses)}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Monthly Breakdown Chart */}
            <Card className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Breakdown</h3>
                <div className="space-y-3">
                    {analytics.monthly_breakdown.map((month, index) => (
                        <div key={month.month} className="flex items-center gap-4">
                            <div className="w-24">
                                <span className="text-sm text-[#e9d5ff] capitalize">
                                    {month.month.slice(0, 3)}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex-1 bg-[rgba(15,10,30,0.6)] rounded-full h-4">
                                        <div
                                            className={`h-4 rounded-full ${getMonthColor(index)}`}
                                            style={{ 
                                                width: `${Math.min((month.expenses_total / Math.max(...analytics.monthly_breakdown.map(m => m.expenses_total))) * 100, 100)}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-white font-medium min-w-fit">
                                        {formatCurrency(month.expenses_total)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-[#e9d5ff]">
                                    <span>{month.journal_entries} entries</span>
                                    <span>{month.expenses_count} transactions</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Top Expense Categories */}
            <Card className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Expense Categories</h3>
                <div className="space-y-3">
                    {analytics.top_expense_categories.map((category, index) => {
                        const percentage = (category.amount / analytics.summary.total_expenses) * 100;
                        return (
                            <div key={category.category} className="flex items-center gap-4">
                                <div className="w-32">
                                    <span className="text-white capitalize">
                                        {category.category}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 bg-[rgba(15,10,30,0.6)] rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full ${getMonthColor(index)}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-white font-medium min-w-fit">
                                            {formatCurrency(category.amount)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-[#e9d5ff]">
                                        {percentage.toFixed(1)}% of total
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {analytics.top_expense_categories.length === 0 && (
                        <p className="text-[#e9d5ff] text-center py-4">
                            No expenses this year
                        </p>
                    )}
                </div>
            </Card>

            {/* Yearly Insights */}
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Yearly Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-white mb-3">Financial Summary</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-[#e9d5ff]">Total Spent</span>
                                <span className="text-sm font-medium text-white">
                                    {formatCurrency(analytics.summary.total_expenses)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[#e9d5ff]">Monthly Average</span>
                                <span className="text-sm font-medium text-white">
                                    {formatCurrency(analytics.summary.average_monthly_expenses)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[#e9d5ff]">Transaction Count</span>
                                <span className="text-sm font-medium text-white">
                                    {analytics.summary.total_transactions}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-white mb-3">Activity Summary</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-[#e9d5ff]">Journal Entries</span>
                                <span className="text-sm font-medium text-white">
                                    {analytics.summary.total_journal_entries}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[#e9d5ff]">Goals Created</span>
                                <span className="text-sm font-medium text-white">
                                    {analytics.summary.goals_created}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[#e9d5ff]">Months Tracked</span>
                                <span className="text-sm font-medium text-white">
                                    {analytics.monthly_breakdown.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default YearlySummaryView;