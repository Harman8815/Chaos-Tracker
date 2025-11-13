import React, { useState, useMemo, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import { Expense } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { DataContext } from '../../App';

const CHART_COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#d946ef'];

// --- Sub-components ---

const PieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    if (!data || data.length === 0 || data.every(d => d.value === 0)) return <div className="text-center text-text-secondary p-4 h-full flex items-center justify-center">No expenses this month.</div>;

    const size = 180;
    const radius = size / 2;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let startAngle = -90;

    const getCoordinatesForPercent = (percent: number) => [
        radius + radius * Math.cos(2 * Math.PI * percent),
        radius + radius * Math.sin(2 * Math.PI * percent),
    ];

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {data.map((slice, i) => {
                    const endAngle = startAngle + (slice.value / total) * 360;
                    const start = getCoordinatesForPercent(startAngle / 360);
                    const end = getCoordinatesForPercent(endAngle / 360);
                    const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
                    const pathData = `M ${start[0]},${start[1]} A ${radius},${radius} 0 ${largeArcFlag} 1 ${end[0]},${end[1]} L ${radius},${radius} Z`;
                    startAngle = endAngle;
                    return <path key={slice.name} d={pathData} fill={CHART_COLORS[i % CHART_COLORS.length]} />;
                })}
            </svg>
             <div className="flex flex-col space-y-1 text-xs">
                {data.map((slice, i) => (
                    <div key={slice.name} className="flex items-center">
                        <div className="w-2 h-2 rounded-sm mr-2" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span>{slice.name} ({total > 0 ? ((slice.value / total) * 100).toFixed(0) : 0}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DailyExpenseChart: React.FC<{ data: { day: number, total: number }[], daysInMonth: number }> = ({ data, daysInMonth }) => {
    const chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const dayData = data.find(d => d.day === i + 1);
        return { label: (i + 1).toString(), value: dayData ? dayData.total : 0 };
    });

    const maxValue = Math.max(...chartData.map(d => d.value), 1);

    return (
        <div className="flex justify-between items-end h-48 w-full gap-1 px-2">
            {chartData.map(item => (
                <div key={item.label} className="flex flex-col items-center justify-end h-full w-full group relative">
                    <div className="absolute -top-6 text-xs bg-card-bg px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">${item.value.toFixed(2)}</div>
                    <div 
                        className="w-full bg-accent-primary rounded-t-sm hover:bg-accent-primary-dark transition-colors" 
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                    />
                    <div className="text-xs text-text-secondary mt-1">{parseInt(item.label) % 2 !== 0 ? item.label : ''}</div>
                </div>
            ))}
        </div>
    );
};

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
    const { expenses, setExpenses } = useContext(DataContext);
    const [date, setDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });
    const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSort = (key: keyof Expense) => {
        setSortConfig(prev => ({
            key,
            direction: prev && prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredExpenses = useMemo(() => {
        return expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.getFullYear() === date.year && expenseDate.getMonth() === date.month;
        });
    }, [expenses, date]);

    const sortedExpenses = useMemo(() => {
        let sortableItems = [...filteredExpenses];
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
    }, [filteredExpenses, sortConfig]);

    const paginatedExpenses = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        return sortedExpenses.slice(startIndex, startIndex + pagination.itemsPerPage);
    }, [sortedExpenses, pagination]);

    const { dailyChartData, categoryChartData, daysInMonth } = useMemo(() => {
        const days = new Date(date.year, date.month + 1, 0).getDate();
        const daily: { [day: number]: number } = {};
        const categories: { [cat: string]: number } = {};
        
        filteredExpenses.forEach(e => {
            const day = new Date(e.date).getDate();
            const total = e.quantity * e.price;
            daily[day] = (daily[day] || 0) + total;
            categories[e.category] = (categories[e.category] || 0) + total;
        });

        return {
            daysInMonth: days,
            dailyChartData: Object.entries(daily).map(([day, total]) => ({ day: parseInt(day), total })),
            categoryChartData: Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value)
        };
    }, [filteredExpenses, date]);

    const handleAddExpense = useCallback((newExpense: Omit<Expense, 'id'>) => {
        setExpenses(prev => [...prev, { ...newExpense, id: uuidv4() }]);
    }, [setExpenses]);

    const handleUpdateExpense = (id: string, updatedField: Partial<Expense>) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedField } : e));
    };

    const years = useMemo(() => Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i), []);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ value: i, name: new Date(0, i).toLocaleString('default', { month: 'long' }) })), []);
    const totalPages = Math.ceil(sortedExpenses.length / pagination.itemsPerPage);

    return (
        <TrackerWrapper tracker={trackerInfo}>
            {isModalOpen && <AddExpenseModal onClose={() => setIsModalOpen(false)} onAdd={handleAddExpense} />}
            <div className="grid grid-cols-5 gap-6 mb-6">
                <Card className="col-span-3">
                    <h3 className="font-bold text-lg mb-2">Daily Spending</h3>
                    <DailyExpenseChart data={dailyChartData} daysInMonth={daysInMonth} />
                </Card>
                <Card className="col-span-2">
                    <h3 className="font-bold text-lg mb-2">Category Breakdown</h3>
                    <PieChart data={categoryChartData} />
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
