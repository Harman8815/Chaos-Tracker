import React, { useState } from 'react';
import { Goal, GoalCategory, GoalPriority, GoalFrequency, CreateGoalPayload } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { X, Plus, Calendar, Tag, Clock, AlertCircle, Trash2 } from 'lucide-react';

interface CreateGoalModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (goal: CreateGoalPayload) => void;
}

const GOAL_TYPE_OPTIONS: { value: GoalCategory; label: string }[] = [
    { value: 'daily', label: 'Daily Goal' },
    { value: 'monthly', label: 'Monthly Goal' },
    { value: 'future', label: 'Future Goal' },
];

const PRIORITY_OPTIONS: { value: GoalPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

const FREQUENCY_OPTIONS: { value: string; label: string }[] = [
    { value: 'none', label: 'No recurrence' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

const REMINDER_OPTIONS = ['1 day before', '1 hour before', 'on the day', 'no reminder'];

interface FormErrors {
    text?: string;
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ open, onClose, onSave }) => {
    const [goalType, setGoalType] = useState<GoalCategory>('daily');
    const [text, setText] = useState('');
    const [description, setDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<GoalPriority>('medium');
    const [targetValue, setTargetValue] = useState(1);
    const [frequency, setFrequency] = useState('none');
    const [reminder, setReminder] = useState('no reminder');
    const [completionCriteria, setCompletionCriteria] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    const resetForm = () => {
        setGoalType('daily');
        setText('');
        setDescription('');
        setCategoryName('');
        setTagsInput('');
        setStartDate('');
        setDueDate('');
        setPriority('medium');
        setTargetValue(1);
        setFrequency('none');
        setReminder('no reminder');
        setCompletionCriteria('');
        setNotes('');
        setErrors({});
    };

    const parseTags = (): string[] => {
        const allTags: string[] = [];
        if (categoryName.trim()) {
            allTags.push(categoryName.trim());
        }
        if (tagsInput.trim()) {
            tagsInput.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
                if (!allTags.includes(t)) allTags.push(t);
            });
        }
        return allTags;
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!text.trim()) {
            newErrors.text = 'Goal name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: CreateGoalPayload = {
            text: text.trim(),
            category: goalType,
            tags: parseTags().length > 0 ? parseTags() : undefined,
            description: description.trim() || undefined,
            priority,
            frequency: frequency as GoalFrequency,
            target: targetValue,
            completed_tasks: 0,
        };

        if (startDate) payload.start_date = startDate;
        if (dueDate) payload.due_date = dueDate;
        if (reminder !== 'no reminder') {
            payload.reminders = [reminder];
        }
        if (completionCriteria.trim()) {
            payload.completion_criteria = completionCriteria.trim();
        }
        if (notes.trim()) {
            payload.notes = notes.trim();
        }

        onSave(payload);
        resetForm();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const showDateFields = goalType === 'monthly' || goalType === 'future';
    const isFuture = goalType === 'future';

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
            <DialogClose />
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-accent-primary" />
                        Create New Goal
                    </DialogTitle>
                    <p className="text-sm text-text-secondary mt-1">
                        Define a new {goalType} goal with optional category, dates, and reminders.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
                    {/* Goal Type Selector */}
                    <div className="space-y-2">
                        <Label>Goal Type</Label>
                        <div className="flex gap-2">
                            {GOAL_TYPE_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setGoalType(opt.value)}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                        goalType === opt.value
                                            ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                                            : 'bg-white/[0.03] text-text-secondary hover:bg-white/[0.06] border border-white/10'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Goal Name */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-name">
                            Goal Name <span className="text-error">*</span>
                        </Label>
                        <Input
                            id="goal-name"
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="What do you want to achieve?"
                            className={errors.text ? 'border-error' : ''}
                        />
                        {errors.text && (
                            <p className="text-xs text-error flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.text}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-description">Description</Label>
                        <Textarea
                            id="goal-description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Add a description or brief overview..."
                            rows={3}
                        />
                    </div>

                    {/* Category Selector/Creator */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-category">Category</Label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                            <Input
                                id="goal-category"
                                type="text"
                                value={categoryName}
                                onChange={e => setCategoryName(e.target.value)}
                                placeholder="e.g. Health, Work, Finance (press comma to add tag)"
                                className="pl-9"
                            />
                        </div>
                        {tagsInput && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {tagsInput.split(',').map((tag, i) => {
                                    const t = tag.trim();
                                    if (!t) return null;
                                    return (
                                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/[0.06] text-text-secondary border border-white/10 flex items-center gap-1">
                                            {t}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const tags = tagsInput.split(',');
                                                    tags.splice(i, 1);
                                                    setTagsInput(tags.join(','));
                                                }}
                                                className="hover:text-error"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Additional Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-tags">Additional Tags (comma-separated)</Label>
                        <Input
                            id="goal-tags"
                            type="text"
                            value={tagsInput}
                            onChange={e => setTagsInput(e.target.value)}
                            placeholder="urgent, important,..."
                        />
                    </div>

                    {/* Date Fields (conditional) */}
                    {showDateFields && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="goal-start-date">Start Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                                    <Input
                                        id="goal-start-date"
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="goal-due-date">
                                    {isFuture ? 'Target Completion Date' : 'Due Date'}
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                                    <Input
                                        id="goal-due-date"
                                        type="date"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Priority */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-priority">Priority</Label>
                        <Select
                            id="goal-priority"
                            value={priority}
                            onChange={v => setPriority(v as GoalPriority)}
                        >
                            {PRIORITY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Target Value */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-target">Target Value</Label>
                        <Input
                            id="goal-target"
                            type="number"
                            min={1}
                            value={targetValue}
                            onChange={e => setTargetValue(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <p className="text-xs text-text-tertiary">
                            Set how many tasks or milestones complete this goal.
                        </p>
                    </div>

                    {/* Frequency (recurring) */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-frequency">Frequency</Label>
                        <Select
                            id="goal-frequency"
                            value={frequency}
                            onChange={setFrequency}
                        >
                            {FREQUENCY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </Select>
                        {goalType === 'daily' && frequency === 'none' && (
                            <p className="text-xs text-text-tertiary">
                                Set a different frequency for recurring daily goals.
                            </p>
                        )}
                    </div>

                    {/* Reminder */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-reminder">Reminder</Label>
                        <Select
                            id="goal-reminder"
                            value={reminder}
                            onChange={setReminder}
                        >
                            {REMINDER_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Completion Criteria */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-criteria">Completion Criteria</Label>
                        <Textarea
                            id="goal-criteria"
                            value={completionCriteria}
                            onChange={e => setCompletionCriteria(e.target.value)}
                            placeholder="How will you know this goal is complete?..."
                            rows={2}
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="goal-notes">Notes (optional)</Label>
                        <Textarea
                            id="goal-notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Any additional thoughts or context..."
                            rows={2}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="border-white/10 text-text-secondary hover:bg-white/[0.06]"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Goal
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGoalModal;
