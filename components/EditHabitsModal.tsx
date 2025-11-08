import React, { useState } from 'react';
import { Habit } from '../types';
import Button from './ui/Button';
import { v4 as uuidv4 } from 'uuid';

interface EditHabitsModalProps {
    habits: Habit[];
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    onClose: () => void;
}

const EditHabitsModal: React.FC<EditHabitsModalProps> = ({ habits, setHabits, onClose }) => {
    const [localHabits, setLocalHabits] = useState<Habit[]>(JSON.parse(JSON.stringify(habits)));

    const handleHabitChange = (id: string, field: keyof Habit, value: string | number) => {
        setLocalHabits(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
    };

    const handleAddHabit = () => {
        setLocalHabits(prev => [...prev, { id: uuidv4(), name: 'New Habit', target: 100, rangeMax: 10 }]);
    };

    const handleDeleteHabit = (id: string) => {
        setLocalHabits(prev => prev.filter(h => h.id !== id));
    };

    const handleSave = () => {
        setHabits(localHabits);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-text-primary">Manage Habits</h2>
                
                <div className="overflow-y-auto pr-4 -mr-4 space-y-4">
                    {localHabits.map(habit => (
                        <div key={habit.id} className="grid grid-cols-12 gap-4 items-center p-3 bg-input-bg rounded-lg">
                            <div className="col-span-5">
                                <label className="text-xs text-text-secondary">Name</label>
                                <input
                                    type="text"
                                    value={habit.name}
                                    onChange={e => handleHabitChange(habit.id, 'name', e.target.value)}
                                    className="w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="text-xs text-text-secondary">Daily Range Max</label>
                                <input
                                    type="number"
                                    value={habit.rangeMax ?? 10}
                                    onChange={e => handleHabitChange(habit.id, 'rangeMax', parseInt(e.target.value))}
                                    className="w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="text-xs text-text-secondary">Monthly Target</label>
                                <input
                                    type="number"
                                    value={habit.target}
                                    onChange={e => handleHabitChange(habit.id, 'target', parseInt(e.target.value))}
                                    className="w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
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

                <div className="mt-6 pt-6 border-t border-border flex justify-between">
                    <Button onClick={handleAddHabit} className="bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white">Add Habit</Button>
                    <div className="flex space-x-4">
                        <Button onClick={onClose} className="bg-input-bg text-text-primary hover:bg-border">Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditHabitsModal;
