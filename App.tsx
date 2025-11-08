import React, { createContext, useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';
import type { AllData, DailyData, Settings, PageId } from './types';
import { DEFAULT_HABITS } from './constants';

interface DataContextType {
  data: AllData;
  updateData: (date: string, newData: Partial<DailyData>) => void;
  selectedPage: PageId;
  setSelectedPage: (pageId: PageId) => void;
  getTodayData: () => DailyData;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const App: React.FC = () => {
  const [data, setData] = useLocalStorage<AllData>('daily-tracker-data', {});
  const [selectedPage, setSelectedPage] = useState<PageId>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage<Settings>('app-settings', {
    theme: 'dark',
    timeFormat: '12h',
    language: 'en',
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(settings.theme === 'dark' ? 'light' : 'dark');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  const getTodayData = (): DailyData => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = data[today] || {};
    if (!todayData.habits || todayData.habits.length === 0) {
        todayData.habits = DEFAULT_HABITS.map(h => ({ ...h, completed: false }));
    }
    return todayData;
  };

  const updateData = (date: string, newData: Partial<DailyData>) => {
    setData(prevData => {
      const dayData = prevData[date] || {};
      const updatedDayData = { ...dayData, ...newData };
      return {
        ...prevData,
        [date]: updatedDayData,
      };
    });
  };

  const dataContextValue: DataContextType = {
    data,
    updateData,
    selectedPage,
    setSelectedPage,
    getTodayData,
  };

  const settingsContextValue: SettingsContextType = {
    settings,
    setSettings,
    isSettingsOpen,
    setIsSettingsOpen,
  };

  return (
    <DataContext.Provider value={dataContextValue}>
      <SettingsContext.Provider value={settingsContextValue}>
        <div className="flex h-screen bg-light-primary dark:bg-primary text-light-text-secondary dark:text-text-secondary">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto">
            <MainContent />
          </main>
          <SettingsModal />
        </div>
      </SettingsContext.Provider>
    </DataContext.Provider>
  );
};

export default App;