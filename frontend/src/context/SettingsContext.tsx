import { createContext, Dispatch, SetStateAction } from 'react';
import { Settings, ScoringRule } from '../types';

interface SettingsContextType {
    settings: Settings;
    setSettings: Dispatch<SetStateAction<Settings>>;
    isSettingsModalOpen: boolean;
    setIsSettingsModalOpen: Dispatch<SetStateAction<boolean>>;
    isEditHabitsModalOpen: boolean;
    setIsEditHabitsModalOpen: Dispatch<SetStateAction<boolean>>;
    isEditRulesModalOpen: boolean;
    setIsEditRulesModalOpen: Dispatch<SetStateAction<boolean>>;
    scoringRules: ScoringRule[];
    setScoringRules: Dispatch<SetStateAction<ScoringRule[]>>;
    t: (key: string) => string;
}

export const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);
