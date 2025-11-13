import React, { useState, createContext, Dispatch, SetStateAction } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { AllData, PageId, Settings, Habit, ScoringRule, PlannerData, ToolId, DataContextType, GoalData, Expense, QuoteSource } from './types';
import { DUMMY_DATA } from './data/dummy_data';
import { DUMMY_QUOTES } from './data/quotes_data';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';
import { DEFAULT_HABITS, DEFAULT_SCORING_RULES } from './constants';
import EditHabitsModal from './components/EditHabitsModal';
import EditRulesModal from './components/EditRulesModal';
import { ToolsProvider, useTools } from './components/ToolsProvider';
import FloatingTools from './components/common/FloatingTools';
import DraggableResizableModal from './components/common/DraggableResizableModal';
import Calculator from './components/tools/Calculator';
import Clock from './components/tools/Clock';
import ChatTool from './components/tools/ChatTool';
import { v4 as uuidv4 } from 'uuid';

const getToday = () => new Date().toISOString().split('T')[0];

const DEFAULT_PLANNER_DATA: PlannerData = {
    blocks: [
        { id: 'block-1', title: 'To-Do', x: 200, y: 200, tasks: [{id: 'task-1', text: 'Create a new block', completed: false}]},
        { id: 'block-2', title: 'In Progress', x: 600, y: 350, tasks: []}
    ],
    links: [],
    transform: { scale: 1, panX: 0, panY: 0 }
};

const DUMMY_EXPENSES: Expense[] = [
    { id: uuidv4(), date: new Date().toISOString().split('T')[0], item: 'Coffee', category: 'Food', quantity: 1, price: 3.50 },
    { id: uuidv4(), date: new Date().toISOString().split('T')[0], item: 'Bus Fare', category: 'Transport', quantity: 2, price: 1.75 },
    { id: uuidv4(), date: new Date(Date.now() - 86400000).toISOString().split('T')[0], item: 'Groceries', category: 'Food', quantity: 1, price: 75.40 },
    { id: uuidv4(), date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], item: 'Movie Tickets', category: 'Entertainment', quantity: 2, price: 15.00 },
    { id: uuidv4(), date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], item: 'Electricity Bill', category: 'Utilities', quantity: 1, price: 120.00 },
];

const DEFAULT_GOALS: GoalData = {
    daily: [
        { id: uuidv4(), text: 'Finish the report for Q3', status: 'active', createdAt: new Date().toISOString(), tags: ['work'] },
        { id: uuidv4(), text: 'Go for a 30-minute run', status: 'completed', createdAt: new Date().toISOString(), completedAt: new Date().toISOString(), tags: ['health'] },
    ],
    monthly: [
        { id: uuidv4(), text: 'Read two books', status: 'active', createdAt: new Date().toISOString(), tags: ['personal growth', 'reading'] },
    ],
    future: [
        { id: uuidv4(), text: 'Plan vacation for next year', status: 'active', createdAt: new Date().toISOString(), tags: ['travel', 'personal'] },
    ]
};


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

const ToolManager: React.FC = () => {
    const { openTools, closeTool, focusTool } = useTools();

    return (
        <>
            <FloatingTools />
            {openTools.map((toolId, index) => {
                const zIndex = 100 + index;
                switch (toolId) {
                    case 'calculator':
                        return (
                            <DraggableResizableModal
                                key={toolId}
                                title="Calculator"
                                onClose={() => closeTool(toolId)}
                                zIndex={zIndex}
                                onFocus={() => focusTool(toolId)}
                                initialSize={{width: 320, height: 480}}
                            >
                                <Calculator />
                            </DraggableResizableModal>
                        );
                    case 'clock':
                         return (
                            <DraggableResizableModal
                                key={toolId}
                                title="Clock"
                                onClose={() => closeTool(toolId)}
                                zIndex={zIndex}
                                onFocus={() => focusTool(toolId)}
                                initialSize={{width: 400, height: 400}}
                            >
                                <Clock />
                            </DraggableResizableModal>
                        );
                    case 'chat':
                         return (
                            <DraggableResizableModal
                                key={toolId}
                                title="AI Assistant"
                                onClose={() => closeTool(toolId)}
                                zIndex={zIndex}
                                onFocus={() => focusTool(toolId)}
                                initialSize={{width: 400, height: 600}}
                            >
                                <ChatTool />
                            </DraggableResizableModal>
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
};


const App: React.FC = () => {
    const [data, setData] = useLocalStorage<AllData>('tracker-data', DUMMY_DATA);
    const [selectedPage, setSelectedPage] = useState<PageId>('home');
    const [habits, setHabits] = useLocalStorage<Habit[]>('tracker-habits', DEFAULT_HABITS);
    const [scoringRules, setScoringRules] = useLocalStorage<ScoringRule[]>('tracker-rules', DEFAULT_SCORING_RULES);
    const [plannerData, setPlannerData] = useLocalStorage<PlannerData>('tracker-planner', DEFAULT_PLANNER_DATA);
    const [goals, setGoals] = useLocalStorage<GoalData>('tracker-goals', DEFAULT_GOALS);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('tracker-expenses', DUMMY_EXPENSES);
    const [quotes, setQuotes] = useLocalStorage<QuoteSource[]>('tracker-quotes', DUMMY_QUOTES);

    
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
            <DataContext.Provider value={{ data, setData, selectedPage, setSelectedPage, today, habits, setHabits, plannerData, setPlannerData, goals, setGoals, expenses, setExpenses, quotes, setQuotes }}>
                <ToolsProvider>
                    <div className={`flex h-screen font-sans text-text-primary bg-background theme-${settings.theme}`}>
                        <Sidebar />
                        <MainContent />
                        {isSettingsModalOpen && <SettingsModal />}
                        {isEditHabitsModalOpen && <EditHabitsModal habits={habits} setHabits={setHabits} onClose={() => setIsEditHabitsModalOpen(false)} />}
                        {isEditRulesModalOpen && <EditRulesModal rules={scoringRules} setRules={setScoringRules} onClose={() => setIsEditRulesModalOpen(false)} />}
                        <ToolManager />
                    </div>
                </ToolsProvider>
            </DataContext.Provider>
        </SettingsContext.Provider>
    );
};

export default App;
