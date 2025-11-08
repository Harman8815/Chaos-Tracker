import React, { useContext } from 'react';
// FIX: Corrected import paths for context and components.
import { DataContext } from '../App';
import HabitTracker from './trackers/HabitTracker';
import PointsTracker from './trackers/PointsTracker';
import JournalTracker from './trackers/JournalTracker';
import Dashboard from './Dashboard';
import HomePage from './HomePage';

const MainContent: React.FC = () => {
    const { selectedPage } = useContext(DataContext);

    const renderPage = () => {
        switch (selectedPage) {
            case 'home':
                return <HomePage />;
            case 'dashboard':
                return <Dashboard />;
            case 'habits':
                return <HabitTracker />;
            case 'points':
                return <PointsTracker />;
            case 'journal':
                return <JournalTracker />;
            default:
                return <div>Select a tracker</div>;
        }
    };

    return (
        <main className="flex-1 bg-background overflow-hidden">
            <div key={selectedPage} className="w-full h-full">
                 {renderPage()}
            </div>
        </main>
    );
};

export default MainContent;