import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

export type ActivityType = 'journal' | 'expense' | 'goal' | 'habit' | 'planner';

interface ActivityData {
    type: ActivityType;
    date?: string;
    title?: string;
    description?: string;
    amount?: number;
    category?: string;
    target_value?: number;
    current_value?: number;
    unit?: string;
    deadline?: string;
}

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (activity: ActivityData) => void;
    defaultType?: ActivityType;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({ 
    isOpen, 
    onClose, 
    onAdd, 
    defaultType = 'journal' 
}) => {
    const [activityType, setActivityType] = useState<ActivityType>(defaultType);
    const [activityData, setActivityData] = useState<ActivityData>({
        type: defaultType,
        date: new Date().toISOString().split('T')[0],
    });

    const activityTypes: { value: ActivityType; label: string; icon: string }[] = [
        { value: 'journal', label: 'Journal Entry', icon: '📝' },
        { value: 'expense', label: 'Expense', icon: '💰' },
        { value: 'goal', label: 'Goal', icon: '🎯' },
        { value: 'habit', label: 'Habit', icon: '✅' },
        { value: 'planner', label: 'Planner Item', icon: '📅' },
    ];

    const expenseCategories = [
        'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills',
        'Healthcare', 'Education', 'Travel', 'Other'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const activity: ActivityData = {
            ...activityData,
            type: activityType,
        };

        // Validate required fields based on type
        if (activityType === 'expense' && (!activityData.amount || activityData.amount === 0)) {
            alert('Please enter an amount');
            return;
        }

        if (activityType === 'goal' && !activityData.title) {
            alert('Please enter a goal title');
            return;
        }

        if (activityType === 'habit' && !activityData.title) {
            alert('Please enter a habit name');
            return;
        }

        onAdd(activity);
        handleClose();
    };

    const handleClose = () => {
        setActivityData({
            type: defaultType,
            date: new Date().toISOString().split('T')[0],
        });
        setActivityType(defaultType);
        onClose();
    };

    const handleTypeChange = (type: ActivityType) => {
        setActivityType(type);
        setActivityData({
            ...activityData,
            type,
            // Reset type-specific fields
            amount: type === 'expense' ? activityData.amount : undefined,
            category: type === 'expense' ? activityData.category : undefined,
            target_value: type === 'goal' || type === 'habit' ? activityData.target_value : undefined,
            current_value: type === 'goal' ? activityData.current_value : undefined,
            unit: type === 'goal' || type === 'habit' ? activityData.unit : undefined,
            deadline: type === 'goal' ? activityData.deadline : undefined,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[rgba(15,10,30,0.75)] rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-accent-primary/35">
                    <h2 className="text-xl font-semibold text-white">Add Activity</h2>
                    <Button 
                        onClick={handleClose} 
                        className="bg-white/[0.06] text-white hover:bg-[rgba(139,92,246,0.35)]"
                    >
                        ×
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Activity Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-white mb-3">
                            Activity Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {activityTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleTypeChange(type.value)}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        activityType === type.value
                                            ? 'border-accent-primary/35 bg-[rgba(139,92,246,0.10)]'
                                            : 'border-accent-primary/35 hover:border-accent-primary/35 hover:bg-[rgba(139,92,246,0.35)]'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">{type.icon}</div>
                                        <div className="text-sm font-medium text-white">
                                            {type.label}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Common Fields */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={activityData.date}
                            onChange={(e) => setActivityData({ ...activityData, date: e.target.value })}
                            className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            required
                        />
                    </div>

                    {/* Type-specific Fields */}
                    {activityType === 'journal' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white mb-2">
                                Journal Entry
                            </label>
                            <textarea
                                value={activityData.description || ''}
                                onChange={(e) => setActivityData({ ...activityData, description: e.target.value })}
                                placeholder="Write about your day..."
                                rows={4}
                                className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                                required
                            />
                        </div>
                    )}

                    {activityType === 'expense' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={activityData.amount || ''}
                                    onChange={(e) => setActivityData({ ...activityData, amount: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                    className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Category
                                </label>
                                <select
                                    value={activityData.category || ''}
                                    onChange={(e) => setActivityData({ ...activityData, category: e.target.value })}
                                    className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    required
                                >
                                    <option value="">Select category</option>
                                    {expenseCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={activityData.description || ''}
                                    onChange={(e) => setActivityData({ ...activityData, description: e.target.value })}
                                    placeholder="What was this expense for?"
                                    className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                />
                            </div>
                        </>
                    )}

                    {activityType === 'goal' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Goal Title
                                </label>
                                <input
                                    type="text"
                                    value={activityData.title || ''}
                                    onChange={(e) => setActivityData({ ...activityData, title: e.target.value })}
                                    placeholder="What do you want to achieve?"
                                    className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={activityData.description || ''}
                                    onChange={(e) => setActivityData({ ...activityData, description: e.target.value })}
                                    placeholder="Describe your goal..."
                                    rows={3}
                                    className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Target Value
                                    </label>
                                    <input
                                        type="number"
                                        value={activityData.target_value || ''}
                                        onChange={(e) => setActivityData({ ...activityData, target_value: parseFloat(e.target.value) || 0 })}
                                        placeholder="100"
                                        className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Current Value
                                    </label>
                                    <input
                                        type="number"
                                        value={activityData.current_value || ''}
                                        onChange={(e) => setActivityData({ ...activityData, current_value: parseFloat(e.target.value) || 0 })}
                                        placeholder="0"
                                        className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Unit
                                    </label>
                                    <input
                                        type="text"
                                        value={activityData.unit || ''}
                                        onChange={(e) => setActivityData({ ...activityData, unit: e.target.value })}
                                        placeholder="kg, miles, etc."
                                        className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={activityData.deadline || ''}
                                        onChange={(e) => setActivityData({ ...activityData, deadline: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {activityType === 'habit' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Habit Name
                                </label>
                                <input
                                    type="text"
                                    value={activityData.title || ''}
                                    onChange={(e) => setActivityData({ ...activityData, title: e.target.value })}
                                    placeholder="e.g., Exercise, Read, Meditate"
                                    className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={activityData.description || ''}
                                    onChange={(e) => setActivityData({ ...activityData, description: e.target.value })}
                                    placeholder="Describe this habit..."
                                    rows={3}
                                    className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Target Value
                                    </label>
                                    <input
                                        type="number"
                                        value={activityData.target_value || ''}
                                        onChange={(e) => setActivityData({ ...activityData, target_value: parseFloat(e.target.value) || 0 })}
                                        placeholder="1"
                                        className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Unit
                                    </label>
                                    <input
                                        type="text"
                                        value={activityData.unit || ''}
                                        onChange={(e) => setActivityData({ ...activityData, unit: e.target.value })}
                                        placeholder="times, hours, etc."
                                        className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {activityType === 'planner' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white mb-2">
                                Planner Item
                            </label>
                            <textarea
                                value={activityData.description || ''}
                                onChange={(e) => setActivityData({ ...activityData, description: e.target.value })}
                                placeholder="Add a task, event, or reminder..."
                                rows={4}
                                className="w-full p-3 rounded-lg border border-accent-primary/35 bg-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                                required
                            />
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-accent-primary/35">
                        <Button
                            type="button"
                            onClick={handleClose}
                            className="bg-white/[0.06] text-white hover:bg-[rgba(139,92,246,0.35)]"
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add {activityTypes.find(t => t.value === activityType)?.label}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddActivityModal;
