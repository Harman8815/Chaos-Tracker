import React, { useState, createContext, Dispatch, SetStateAction } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { AllData, PageId, Settings, Habit, ScoringRule, PlannerData } from './types';
import { DUMMY_DATA } from './data/dummy_data';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';
import { DEFAULT_HABITS, DEFAULT_SCORING_RULES } from './constants';
import EditHabitsModal from './components/EditHabitsModal';
import EditRulesModal from './components/EditRulesModal';

const getToday = () => new Date().toISOString().split('T')[0];

const DEFAULT_PLANNER_DATA: PlannerData = {
    blocks: [
        { id: 'block-1', title: 'To-Do', x: 200, y: 200, tasks: [{id: 'task-1', text: 'Create a new block', completed: false}]},
        { id: 'block-2', title: 'In Progress', x: 600, y: 350, tasks: []}
    ],
    links: [],
    transform: { scale: 1, panX: 0, panY: 0 }
};

interface DataContextType {
    data: AllData;
    setData: Dispatch<SetStateAction<AllData>>;
    selectedPage: PageId;
    setSelectedPage: Dispatch<SetStateAction<PageId>>;
    today: string;
    habits: Habit[];
    setHabits: Dispatch<SetStateAction<Habit[]>>;
    plannerData: PlannerData;
    setPlannerData: Dispatch<SetStateAction<PlannerData>>;
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
    const [selectedPage, setSelectedPage] = useState<PageId>('home');
    const [habits, setHabits] = useLocalStorage<Habit[]>('tracker-habits', DEFAULT_HABITS);
    const [scoringRules, setScoringRules] = useLocalStorage<ScoringRule[]>('tracker-rules', DEFAULT_SCORING_RULES);
    const [plannerData, setPlannerData] = useLocalStorage<PlannerData>('tracker-planner', DEFAULT_PLANNER_DATA);
    
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

    React.useEffect(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // matches transition duration in index.html
        }
    }, []);


    return (
        <SettingsContext.Provider value={{ settings, setSettings, isSettingsModalOpen, setIsSettingsModalOpen, isEditHabitsModalOpen, setIsEditHabitsModalOpen, isEditRulesModalOpen, setIsEditRulesModalOpen, scoringRules, setScoringRules }}>
            <DataContext.Provider value={{ data, setData, selectedPage, setSelectedPage, today, habits, setHabits, plannerData, setPlannerData }}>
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
