"use client";

import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { AllData, PageId, Settings, Habit, ScoringRule, PlannerData, GoalData, Expense, QuoteSource, Achievement, UserProfile, Language } from '../types';
import { DUMMY_DATA } from '../data/dummy_data';
import { DUMMY_QUOTES } from '../data/quotes_data';
import { DUMMY_ACHIEVEMENTS } from '../data/achievements_data';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';
import { DEFAULT_HABITS, DEFAULT_SCORING_RULES } from '../constants';
import EditHabitsModal from './EditHabitsModal';
import EditRulesModal from './EditRulesModal';
import { ToolsProvider, useTools } from './ToolsProvider';
import FloatingTools from './common/FloatingTools';
import DraggableResizableModal from './common/DraggableResizableModal';
import Calculator from './tools/Calculator';
import Clock from './tools/Clock';
import ChatTool from './tools/ChatTool';
import LoginPage from './auth/LoginPage';
import SignUpPage from './auth/SignUpPage';
import { v4 as uuidv4 } from 'uuid';
import { fetchAppData } from '../api/services';
import { DataContext } from '../context/DataContext';
import { SettingsContext } from '../context/SettingsContext';
import { Menu } from 'lucide-react';

const getToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const DEFAULT_PLANNER_DATA: PlannerData = {
    blocks: [
        { id: 'block-1', title: 'To-Do', x: 200, y: 200, tasks: [{ id: 'task-1', text: 'Create a new block', completed: false }] },
        { id: 'block-2', title: 'In Progress', x: 600, y: 350, tasks: [] }
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
        { id: 1, text: 'Finish the report for Q3', status: 'active', category: 'daily', created_at: new Date().toISOString(), tags: ['work'] },
        { id: 2, text: 'Go for a 30-minute run', status: 'completed', category: 'daily', created_at: new Date().toISOString(), completed_at: new Date().toISOString(), tags: ['health'] },
    ],
    monthly: [
        { id: 3, text: 'Read two books', status: 'active', category: 'monthly', created_at: new Date().toISOString(), tags: ['personal growth', 'reading'] },
    ],
    future: [
        { id: 4, text: 'Plan vacation for next year', status: 'active', category: 'future', created_at: new Date().toISOString(), tags: ['travel', 'personal'] },
    ]
};

const DEFAULT_USER_PROFILE: UserProfile = {
    name: 'Guest User',
    email: 'guest@example.com',
    joinDate: new Date().toISOString(),
    bio: 'Consistent self-improver. Tracking habits one day at a time.',
    location: 'Global',
    skills: ['Consistency', 'Planning', 'Growth'],
    socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com'
    }
};

const translations: Record<Language, Record<string, string>> = {
    en: {
        'home': 'Home', 'dashboard': 'Dashboard', 'planner': 'Planner', 'points': 'Points', 'journal': 'Journal', 'expense': 'Expenses', 'goals': 'Goals', 'quotes': 'Quotes', 'achievements': 'Achievements', 'settings': 'Settings', 'profile': 'Profile',
        'Theme': 'Theme', 'Time Format': 'Time Format', 'Language (UI Only)': 'Language (UI Only)', 'light': 'light', 'dark': 'dark', '12-Hour': '12-Hour', '24-Hour': '24-Hour', 'English': 'English', 'Español': 'Español', 'Français': 'Français', 'Close': 'Close',
    },
    es: {
        'home': 'Inicio', 'dashboard': 'Tablero', 'planner': 'Planificateur', 'points': 'Puntos', 'journal': 'Diario', 'expense': 'Gastos', 'goals': 'Metas', 'quotes': 'Citas', 'achievements': 'Logros', 'settings': 'Ajustes', 'profile': 'Perfil',
        'Theme': 'Tema', 'Time Format': 'Formato de Hora', 'Language (UI Only)': 'Idioma (Solo UI)', 'light': 'claro', 'dark': 'oscuro', '12-Hour': '12 horas', '24-Hour': '24 horas', 'English': 'Inglés', 'Español': 'Español', 'Français': 'Francés', 'Close': 'Cerrar',
    },
    fr: {
        'home': 'Accueil', 'dashboard': 'Tableau de bord', 'planner': 'Planificateur', 'points': 'Points', 'journal': 'Journal', 'expense': 'Dépenses', 'goals': 'Objectifs', 'quotes': 'Citations', 'achievements': 'Réalisations', 'settings': 'Paramètres', 'profile': 'Profil',
        'Theme': 'Thème', 'Time Format': "Format de l'heure", 'Language (UI Only)': 'Langue (UI uniquement)', 'light': 'clair', 'dark': 'sombre', '12-Hour': '12 heures', '24-Hour': '24 heures', 'English': 'Anglais', 'Español': 'Espagnol', 'Français': 'Français', 'Close': 'Fermer',
    }
};

const ToolManager: React.FC = () => {
    const { openTools, closeTool, focusTool } = useTools();

    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined' && window.innerWidth < 640) {
                openTools.forEach(id => closeTool(id));
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [openTools, closeTool]);

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
                                initialSize={{ width: 320, height: 560 }}
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
                                initialSize={{ width: 400, height: 400 }}
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
                                initialSize={{ width: 400, height: 600 }}
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

export default function Providers({ children }: { children: React.ReactNode }) {
    const [data, setData] = useLocalStorage<AllData>('tracker-data', DUMMY_DATA);
    const [selectedPage, setSelectedPage] = useState<PageId>('home');
    const [habits, setHabits] = useLocalStorage<Habit[]>('tracker-habits', DEFAULT_HABITS);
    const [scoringRules, setScoringRules] = useLocalStorage<ScoringRule[]>('tracker-rules', DEFAULT_SCORING_RULES);
    const [plannerData, setPlannerData] = useLocalStorage<PlannerData>('tracker-planner', DEFAULT_PLANNER_DATA);
    const [goals, setGoals] = useLocalStorage<GoalData>('tracker-goals', DEFAULT_GOALS);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('tracker-expenses', DUMMY_EXPENSES);
    const [quotes, setQuotes] = useLocalStorage<QuoteSource[]>('tracker-quotes', DUMMY_QUOTES);
    const [achievements, setAchievements] = useLocalStorage<Achievement[]>('tracker-achievements', DUMMY_ACHIEVEMENTS);
    const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('tracker-user-profile', DEFAULT_USER_PROFILE);

    const [settings, setSettings] = useLocalStorage<Settings>('tracker-settings', {
        theme: 'dark',
        timeFormat: '24h',
        language: 'en',
        notifications: true,
    });

    const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('tracker-auth', false);
    const [authView, setAuthView] = useState<'login' | 'signup'>('login');

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isEditHabitsModalOpen, setIsEditHabitsModalOpen] = useState(false);
    const [isEditRulesModalOpen, setIsEditRulesModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [sidebarState, setSidebarState] = useState<'expanded' | 'collapsed' | 'mobile'>('expanded');

    const today = getToday();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setSidebarState('mobile');
                setIsMobileMenuOpen(false);
            } else if (width >= 768 && width < 1280) {
                setSidebarState('collapsed');
                setIsMobileMenuOpen(false);
            } else {
                setSidebarState('expanded');
                setIsMobileMenuOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    const t = (key: string): string => {
        return translations[settings.language][key] || key;
    };

    useEffect(() => {
        const root = document.documentElement;
        if (settings.theme === 'light') {
            root.classList.add('light');
            root.classList.remove('dark');
        } else {
            root.classList.remove('light');
            root.classList.add('dark');
        }
    }, [settings.theme]);

    useEffect(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 1000);
        }
    }, []);

    // API Data Sync Effect
    useEffect(() => {
        const syncData = async () => {
            if (!isAuthenticated) return;

            try {
                console.log('Attempting to sync with remote server...');
                const apiData = await fetchAppData();

                if (apiData) {
                    console.log('Remote data found, syncing...', apiData);
                    if (apiData.data) setData(apiData.data);
                    if (apiData.habits) setHabits(apiData.habits);
                    if (apiData.rules) setScoringRules(apiData.rules);
                    if (apiData.planner) setPlannerData(apiData.planner);
                    if (apiData.goals) setGoals(apiData.goals);
                    if (apiData.expenses) setExpenses(apiData.expenses);
                    if (apiData.quotes) setQuotes(apiData.quotes);
                    if (apiData.achievements) setAchievements(apiData.achievements);
                    if (apiData.userProfile) setUserProfile(apiData.userProfile);
                }
            } catch (error) {
                console.warn("API sync failed or unavailable. Using local fallback data.", error);
            }
        };

        syncData();
    }, [isAuthenticated]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings, isSettingsModalOpen, setIsSettingsModalOpen, isEditHabitsModalOpen, setIsEditHabitsModalOpen, isEditRulesModalOpen, setIsEditRulesModalOpen, scoringRules, setScoringRules, t }}>
            <DataContext.Provider value={{ data, setData, selectedPage, setSelectedPage, today, habits, setHabits, plannerData, setPlannerData, goals, setGoals, expenses, setExpenses, quotes, setQuotes, achievements, setAchievements, userProfile, setUserProfile, logout }}>
                <ToolsProvider>
                    <div className={`flex h-screen font-sans text-white bg-[#0f0f23] theme-${settings.theme}`}>
                        {!mounted ? (
                            <div className="w-full h-full flex items-center justify-center relative">
                                <div className="text-[#e9d5ff]">Loading...</div>
                            </div>
                        ) : !isAuthenticated ? (
                            <div className="w-full h-full flex items-center justify-center relative">
                                {authView === 'login' ? (
                                    <LoginPage onLogin={login} onSwitchToSignUp={() => setAuthView('signup')} />
                                ) : (
                                    <SignUpPage onSignUp={login} onSwitchToLogin={() => setAuthView('login')} />
                                )}
                            </div>
                        ) : (
                            <>
                                {sidebarState === 'mobile' && (
                                    <>
                                        <button
                                            onClick={() => setIsMobileMenuOpen(true)}
                                            aria-label="Open menu"
                                            className="fixed top-4 left-4 z-50 w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 text-white hover:border-accent-primary transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.15)] flex items-center justify-center"
                                        >
                                            <Menu className="w-6 h-6" />
                                        </button>
                                        {isMobileMenuOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                />
                                                <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0f0f23] border-r border-white/10 shadow-2xl">
                                                    <Sidebar
                                                        isCollapsed={false}
                                                        toggleSidebar={() => setIsMobileMenuOpen(false)}
                                                        onNavigate={() => setIsMobileMenuOpen(false)}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                                {(sidebarState === 'expanded' || sidebarState === 'collapsed') && (
                                    <Sidebar
                                        isCollapsed={sidebarState === 'collapsed'}
                                        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                    />
                                )}
                                <div className={`flex-1 h-full overflow-hidden relative z-10 transition-all duration-300 ${sidebarState === 'mobile' ? 'w-full' : ''}`}>
                                    {children}
                                </div>
                            </>
                        )}
                        {isSettingsModalOpen && <SettingsModal />}
                        {isEditHabitsModalOpen && <EditHabitsModal habits={habits} setHabits={setHabits} onClose={() => setIsEditHabitsModalOpen(false)} />}
                        {isEditRulesModalOpen && <EditRulesModal rules={scoringRules} setRules={setScoringRules} onClose={() => setIsEditRulesModalOpen(false)} />}
                    </div>
                </ToolsProvider>
            </DataContext.Provider>
        </SettingsContext.Provider>
    );
}
