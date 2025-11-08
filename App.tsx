import React, { useState, createContext, Dispatch, SetStateAction } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { AllData, PageId, Settings, Habit, ScoringRule } from './types';
import { DUMMY_DATA } from './data/dummy_data';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';
import { DEFAULT_HABITS, DEFAULT_SCORING_RULES } from './constants';
import EditHabitsModal from './components/EditHabitsModal';
import EditRulesModal from './components/EditRulesModal';

const getToday = () => new Date().toISOString().split('T')[0];

interface DataContextType {
    data: AllData;
    setData: Dispatch<SetStateAction<AllData>>;
    selectedPage: PageId;
    setSelectedPage: Dispatch<SetStateAction<PageId>>;
    today: string;
    habits: Habit[];
    setHabits: Dispatch<SetStateAction<Habit[]>>;
}

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
}

export const DataContext = createContext<DataContextType>({} as DataContextType);
export const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

const App: React.FC = () => {
    const [data, setData] = useLocalStorage<AllData>('tracker-data', DUMMY_DATA);
    const [selectedPage, setSelectedPage] = useState<PageId>('points');
    const [habits, setHabits] = useLocalStorage<Habit[]>('tracker-habits', DEFAULT_HABITS);
    const [scoringRules, setScoringRules] = useLocalStorage<ScoringRule[]>('tracker-rules', DEFAULT_SCORING_RULES);
    
    const [settings, setSettings] = useLocalStorage<Settings>('tracker-settings', {
        theme: 'dark',
        timeFormat: '24h',
        language: 'en',
    });
    
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isEditHabitsModalOpen, setIsEditHabitsModalOpen] = useState(false);
    const [isEditRulesModalOpen, setIsEditRulesModalOpen] = useState(false);
    
    const today = getToday();

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }, [settings.theme]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings, isSettingsModalOpen, setIsSettingsModalOpen, isEditHabitsModalOpen, setIsEditHabitsModalOpen, isEditRulesModalOpen, setIsEditRulesModalOpen, scoringRules, setScoringRules }}>
            <DataContext.Provider value={{ data, setData, selectedPage, setSelectedPage, today, habits, setHabits }}>
                <div className={`flex h-screen font-sans text-text-primary bg-background theme-${settings.theme}`}>
                    <Sidebar />
                    <MainContent />
                    {isSettingsModalOpen && <SettingsModal />}
                    {isEditHabitsModalOpen && <EditHabitsModal habits={habits} setHabits={setHabits} onClose={() => setIsEditHabitsModalOpen(false)} />}
                    {isEditRulesModalOpen && <EditRulesModal rules={scoringRules} setRules={setScoringRules} onClose={() => setIsEditRulesModalOpen(false)} />}
                </div>
            </DataContext.Provider>
        </SettingsContext.Provider>
    );
};

export default App;