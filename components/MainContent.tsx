import React, { useContext } from 'react';
import { DataContext } from '../App';
import Dashboard from './Dashboard';
import HabitTracker from './trackers/HabitTracker';
import MoodTracker from './trackers/MoodTracker';
import JournalTracker from './trackers/JournalTracker';
import TrackerWrapper from './TrackerWrapper';
import { TRACKERS } from '../constants';
import HomePage from './HomePage';

const MainContent: React.FC = () => {
    const dataContext = useContext(DataContext);
    if (!dataContext) {
        return <div>Loading...</div>;
    }

    const { selectedPage, getTodayData } = dataContext;
    const todayData = getTodayData();

    const renderContent = () => {
        const trackerInfo = TRACKERS.find(t => t.id === selectedPage);
        
        switch (selectedPage) {
            case 'home':
                return <HomePage />;
            case 'dashboard':
                return <Dashboard />;
            case 'habits':
                return (
                    <TrackerWrapper title="Habit Tracker" icon={trackerInfo!.icon}>
                        <HabitTracker todayData={todayData} />
                    </TrackerWrapper>
                );
            case 'mood':
                 return (
                    <TrackerWrapper title="Mood Tracker" icon={trackerInfo!.icon}>
                        <MoodTracker todayData={todayData} />
                    </TrackerWrapper>
                );
            case 'journal':
                 return (
                    <TrackerWrapper title="Journal" icon={trackerInfo!.icon}>
                        <JournalTracker todayData={todayData} />
                    </TrackerWrapper>
                );
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="animate-fadeIn">
            {renderContent()}
        </div>
    );
};

export default MainContent;