import React, { useState } from 'react';
import { Habit } from '../types';
import Button from './ui/Button';
import { pointsService } from '../services/pointsService';

interface EditHabitsModalProps {
    habits: Habit[];
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    onClose: () => void;
}

const EditHabitsModal: React.FC<EditHabitsModalProps> = ({ habits, setHabits, onClose }) => {
    const [localHabits, setLocalHabits] = useState<Habit[]>(JSON.parse(JSON.stringify(habits)));
    const [deletedHabitIds, setDeletedHabitIds] = useState<string[]>([]);

    const handleHabitChange = (id: string, field: keyof Habit, value: string | number) => {
        setLocalHabits(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
    };

    const handleAddHabit = () => {
        const newHabit = { name: 'New Habit', target: 100, rangeMax: 10, id: `new-${Date.now()}` };
        setLocalHabits(prev => [...prev, newHabit]);
    };

    const handleDeleteHabit = (id: string) => {
        setDeletedHabitIds(prev => [...prev, id]);
        setLocalHabits(prev => prev.filter(h => h.id !== id));
    };

    const handleSave = async () => {
        try {
            // Handle deletions
            await Promise.all(deletedHabitIds.map(id => pointsService.deleteHabit(id)));

            // Handle additions and updates
            const promises = localHabits.map(habit => {
                const { id, ...habitData } = habit;
                if (id.startsWith('new-')) {
                    return pointsService.createHabit(habitData);
                } else {
                    const originalHabit = habits.find(h => h.id === id);
                    if (JSON.stringify(originalHabit) !== JSON.stringify(habit)) {
                        return pointsService.updateHabit(id, habitData);
                    }
                }
                return Promise.resolve(null);
            });

            const updatedHabits = await Promise.all(promises);

            // Fetch the latest habits list
            const freshHabits = await pointsService.getHabits();
            setHabits(freshHabits);

            onClose();
        } catch (error) {
            console.error("Error saving habits:", error);
            // Optionally, show an error message to the user
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="glass backdrop-blur-xl rounded-xl shadow-[0_0_25px_rgba(124,58,237,0.35)] w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-white">Manage Habits</h2>
                
                <div className="overflow-y-auto pr-4 -mr-4 space-y-4">
                    {localHabits.map(habit => (
                        <div key={habit.id} className="grid grid-cols-12 gap-4 items-center p-3 bg-white/[0.06] rounded-lg">
                            <div className="col-span-5">
                                <label className="text-xs text-text-secondary">Name</label>
                                <input
                                    type="text"
                                    value={habit.name}
                                    onChange={e => handleHabitChange(habit.id, 'name', e.target.value)}
                                    className="w-full mt-1 p-2 rounded-md bg-background border border-accent-primary/35 text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="text-xs text-text-secondary">Daily Range Max</label>
                                <input
                                    type="number"
                                    value={habit.rangeMax ?? 10}
                                    onChange={e => handleHabitChange(habit.id, 'rangeMax', parseInt(e.target.value))}
                                    className="w-full mt-1 p-2 rounded-md bg-background border border-accent-primary/35 text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="text-xs text-text-secondary">Monthly Target</label>
                                <input
                                    type="number"
                                    value={habit.target}
                                    onChange={e => handleHabitChange(habit.id, 'target', parseInt(e.target.value))}
                                    className="w-full mt-1 p-2 rounded-md bg-background border border-accent-primary/35 text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                />
                            </div>
                            <div className="col-span-1 flex items-end">
                                <button onClick={() => handleDeleteHabit(habit.id)} className="text-red-500 hover:text-red-400 p-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-accent-primary/35 flex justify-between">
                    <Button onClick={handleAddHabit} className="bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white">Add Habit</Button>
                    <div className="flex space-x-4">
                        <Button onClick={onClose} className="bg-white/[0.06] text-white hover:bg-[rgba(139,92,246,0.35)]">Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditHabitsModal;

