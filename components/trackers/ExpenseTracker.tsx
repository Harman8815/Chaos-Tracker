import React from 'react';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';

const ExpenseTracker: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'expense')!;
    
    return (
        <TrackerWrapper tracker={trackerInfo}>
            <div className="flex items-center justify-center h-full">
                <p className="text-2xl text-text-secondary">Expense Tracker coming soon!</p>
            </div>
        </TrackerWrapper>
    );
};

export default ExpenseTracker;