import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import { Expense } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import expenseService from '../../services/expenseService';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';

const AddExpenseModal: React.FC<{ onClose: () => void; onAdd: (expense: Omit<Expense, 'id'>) => void; }> = ({ onClose, onAdd }) => {
    const [item, setItem] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!item || !category || quantity <= 0 || price <= 0) return;
        onAdd({ date, item, category, quantity, price });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-text-primary">Add New Expense</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 rounded-md bg-input-bg border border-border" required />
                    <input placeholder="Item" value={item} onChange={e => setItem(e.target.value)} className="w-full p-2 rounded-md bg-input-bg border border-border" required />
                    <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 rounded-md bg-input-bg border border-border" required />
                    <div className="flex gap-4">
                        <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-1/2 p-2 rounded-md bg-input-bg border border-border" min="1" required />
                        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="w-1/2 p-2 rounded-md bg-input-bg border border-border" step="0.01" min="0.01" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" onClick={onClose} className="bg-input-bg text-text-primary hover:bg-border">Cancel</Button>
                        <Button type="submit">Add Expense</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Component ---

const ExpenseTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'expense')!;
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });
    const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analytics, setAnalytics] = useState<any>(null);
    // Transform daily_breakdown for BarChart
    const dailyChartData = useMemo(() => {
        if (!analytics?.daily_breakdown) return [] as { name: string; value: number }[];
        return analytics.daily_breakdown.map((d: { day: number; total: number }) => ({
            name: d.day.toString(),
            value: d.total,
        }));
    }, [analytics]);

    // Fetch expenses for current month
    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await expenseService.getAllExpenses({
                year: date.year,
                month: date.month
            });
            setExpenses(response.expenses || []);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    }, [date.year, date.month]);

    // Fetch analytics for charts
    const fetchAnalytics = useCallback(async () => {
        try {
            const response = await expenseService.getExpenseAnalytics({
                year: date.year,
                month: date.month
            });
            setAnalytics(response.analytics);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setAnalytics(null);
        }
    }, [date.year, date.month]);

    useEffect(() => {
        fetchExpenses();
        fetchAnalytics();
    }, [fetchExpenses, fetchAnalytics]);

    const handleSort = (key: keyof Expense) => {
        setSortConfig(prev => ({
            key,
            direction: prev && prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedExpenses = useMemo(() => {
        let sortableItems = [...expenses];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
                }
                if (sortConfig.key === 'date') {
                    return sortConfig.direction === 'asc'
                        ? new Date(valA).getTime() - new Date(valB).getTime()
                        : new Date(valB).getTime() - new Date(valA).getTime();
                }
                return sortConfig.direction === 'asc'
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            });
        }
        return sortableItems;
    }, [expenses, sortConfig]);

    const paginatedExpenses = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        return sortedExpenses.slice(startIndex, startIndex + pagination.itemsPerPage);
    }, [sortedExpenses, pagination]);

    const handleAddExpense = useCallback(async (newExpense: Omit<Expense, 'id'>) => {
        try {
            await expenseService.createExpense(newExpense);
            await fetchExpenses();
            await fetchAnalytics();
        } catch (error) {
            console.error('Error creating expense:', error);
        }
    }, [fetchExpenses, fetchAnalytics]);

    const handleUpdateExpense = async (id: string, updatedField: Partial<Expense>) => {
        try {
            await expenseService.updateExpense(id, updatedField);
            await fetchExpenses();
            await fetchAnalytics();
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            await expenseService.deleteExpense(id);
            await fetchExpenses();
            await fetchAnalytics();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const years = useMemo(() => Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i), []);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ value: i, name: new Date(0, i).toLocaleString('default', { month: 'long' }) })), []);
    const totalPages = Math.ceil(sortedExpenses.length / pagination.itemsPerPage);

    if (loading && !analytics) {
        return (
            <TrackerWrapper tracker={trackerInfo}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-text-secondary">Loading expenses...</div>
                </div>
            </TrackerWrapper>
        );
    }

    return (
        <TrackerWrapper tracker={trackerInfo}>
            {isModalOpen && <AddExpenseModal onClose={() => setIsModalOpen(false)} onAdd={handleAddExpense} />}
            <div className="grid grid-cols-5 gap-6 mb-6">
                <Card className="col-span-3">
                    <BarChart title="Daily Spending" data={dailyChartData} totalBars={analytics?.days_in_month || 30} />
                </Card>
                <Card className="col-span-2">
                    <PieChart title="Daily Spending" data={analytics?.category_breakdown || []} />
                </Card>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <select value={date.month} onChange={e => setDate(d => ({ ...d, month: parseInt(e.target.value) }))} className="p-2 rounded-md bg-input-bg border border-border">
                            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                        </select>
                        <select value={date.year} onChange={e => setDate(d => ({ ...d, year: parseInt(e.target.value) }))} className="p-2 rounded-md bg-input-bg border border-border">
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>+ Add Entry</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-input-bg">
                            <tr>
                                {(['date', 'item', 'category', 'quantity', 'price'] as (keyof Expense)[]).map(key => (
                                    <th key={key} className="p-3 capitalize cursor-pointer" onClick={() => handleSort(key)}>
                                        {key} {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                    </th>
                                ))}
                                <th className="p-3">Total</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedExpenses.map(expense => (
                                <tr key={expense.id} className="border-b border-border hover:bg-input-bg/50">
                                    {(['date', 'item', 'category', 'quantity', 'price'] as (keyof Expense)[]).map(key => (
                                        <td key={key} className="p-0">
                                            <input
                                                type={key === 'date' ? 'date' : key === 'quantity' || key === 'price' ? 'number' : 'text'}
                                                value={expense[key]}
                                                onChange={e => handleUpdateExpense(expense.id, { [key]: key === 'quantity' ? parseInt(e.target.value) : key === 'price' ? parseFloat(e.target.value) : e.target.value })}
                                                className="w-full h-full bg-transparent p-3 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                                step={key === 'price' ? '0.01' : '1'}
                                            />
                                        </td>
                                    ))}
                                    <td className="p-3 font-mono">${(expense.quantity * expense.price).toFixed(2)}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDeleteExpense(expense.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select value={pagination.itemsPerPage} onChange={e => setPagination(p => ({ ...p, itemsPerPage: parseInt(e.target.value), currentPage: 1 }))} className="p-1 rounded-md bg-input-bg border border-border">
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))} disabled={pagination.currentPage === 1}>Prev</Button>
                        <span>Page {pagination.currentPage} of {totalPages}</span>
                        <Button onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))} disabled={pagination.currentPage === totalPages}>Next</Button>
                    </div>
                </div>
            </Card>
        </TrackerWrapper>
    );
};

export default ExpenseTracker;
