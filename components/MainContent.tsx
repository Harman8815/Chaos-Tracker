import React, { useContext } from 'react';
import { DataContext } from '../App';
import Planner from './trackers/Planner';
import PointsTracker from './trackers/PointsTracker';
import JournalTracker from './trackers/JournalTracker';
import Dashboard from './Dashboard';
import HomePage from './HomePage';
import ExpenseTracker from './trackers/ExpenseTracker';
import GoalTracker from './trackers/GoalTracker';
import QuoteCollector from './trackers/QuoteCollector';

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
            case 'expense':
                return <ExpenseTracker />;
            case 'goals':
                return <GoalTracker />;
            case 'quotes':
                return <QuoteCollector />;
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