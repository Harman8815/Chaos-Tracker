import React, { createContext, Dispatch, SetStateAction, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, ScoringRule, Theme, ThemeDensity } from '../types';
import { applyThemeCustomizations } from '../lib/themeTokens';

export interface SettingsContextType {
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
    toggleTheme: () => void;
    toggleDensity: () => void;
    applyCustomizations: () => void;
    navigate: (href: string) => void;
}

export const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export const nextTheme = (current: Theme): Theme => (current === 'light' ? 'dark' : 'light');

export const nextDensity = (current: ThemeDensity): ThemeDensity => {
    switch (current) {
        case 'compact':
            return 'comfortable';
        case 'comfortable':
            return 'spacious';
        default:
            return 'compact';
    }
};

export const SettingsEffects: React.FC<{ 
    settings: Settings; 
    children: React.ReactNode;
    value: Omit<SettingsContextType, 'settings' | 'navigate'>;
}> = ({ settings, children, value }) => {
    const router = useRouter();
    
    const navigate = (href: string) => {
        router.push(href);
    };

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(settings.theme === 'light' ? 'light' : 'dark');
    }, [settings.theme]);

    useEffect(() => {
        applyThemeCustomizations(settings);
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ ...value, settings, navigate }}>
            {children}
        </SettingsContext.Provider>
    );
};
