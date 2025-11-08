import React, { useState } from 'react';
import { ScoringRule } from '../types';
import Button from './ui/Button';
import { v4 as uuidv4 } from 'uuid';

interface EditRulesModalProps {
    rules: ScoringRule[];
    setRules: React.Dispatch<React.SetStateAction<ScoringRule[]>>;
    onClose: () => void;
}

const EditRulesModal: React.FC<EditRulesModalProps> = ({ rules, setRules, onClose }) => {
    const [localRules, setLocalRules] = useState<ScoringRule[]>(JSON.parse(JSON.stringify(rules)));

    const handleRuleChange = (id: string, field: keyof ScoringRule, value: string | number) => {
        setLocalRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleAddRule = () => {
        setLocalRules(prev => [...prev, { id: uuidv4(), activity: 'New Activity', maxPoints: 10, penaltyRule: '', zeroPointsCondition: '', scoringLogic: '' }]);
    };

    const handleDeleteRule = (id: string) => {
        setLocalRules(prev => prev.filter(r => r.id !== id));
    };

    const handleSave = () => {
        setRules(localRules);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-text-primary">Edit Scoring Rules</h2>
                
                <div className="overflow-y-auto pr-4 -mr-4 space-y-4">
                    {localRules.map(rule => (
                        <div key={rule.id} className="p-3 bg-input-bg rounded-lg space-y-2">
                             <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-3">
                                    <label className="text-xs text-text-secondary">Activity</label>
                                    <input type="text" value={rule.activity} onChange={e => handleRuleChange(rule.id, 'activity', e.target.value)} className="w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"/>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-text-secondary">Max Points</label>
                                    <input type="number" value={rule.maxPoints} onChange={e => handleRuleChange(rule.id, 'maxPoints', parseInt(e.target.value))} className="w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"/>
                                </div>
                                <div className="col-span-6">
                                     <label className="text-xs text-text-secondary">Penalty Rule</label>
                                    <input type="text" value={rule.penaltyRule} onChange={e => handleRuleChange(rule.id, 'penaltyRule', e.target.value)} className="w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"/>
                                </div>
                                <div className="col-span-1 flex items-end">
                                    <button onClick={() => handleDeleteRule(rule.id)} className="text-red-500 hover:text-red-400 p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                    </button>
                                </div>
                             </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-text-secondary">0 Points Condition</label>
                                    <input type="text" value={rule.zeroPointsCondition} onChange={e => handleRuleChange(rule.id, 'zeroPointsCondition', e.target.value)} className="w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"/>
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary">Scoring Logic / Notes</label>
                                    <input type="text" value={rule.scoringLogic} onChange={e => handleRuleChange(rule.id, 'scoringLogic', e.target.value)} className="w-full mt-1 p-2 rounded-md bg-background border border-border text-text-primary"/>
                                </div>
                              </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border flex justify-between">
                    <Button onClick={handleAddRule} className="bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white">Add Rule</Button>
                    <div className="flex space-x-4">
                        <Button onClick={onClose} className="bg-input-bg text-text-primary hover:bg-border">Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditRulesModal;
