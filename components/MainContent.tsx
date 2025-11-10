import React, { useContext } from 'react';
import { DataContext } from '../App';
import Planner from './trackers/Planner';
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
            case 'planner':
                return <Planner />;
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
