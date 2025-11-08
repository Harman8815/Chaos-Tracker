import React from 'react';
// FIX: Corrected import path for types.
import { Tracker } from '../types';

interface TrackerWrapperProps {
    tracker: Tracker;
    children: React.ReactNode;
}

const TrackerWrapper: React.FC<TrackerWrapperProps> = ({ tracker, children }) => {
    return (
        <div className="p-6 h-full overflow-y-auto animate-fade-in">
            <div className="flex items-center mb-6">
                <tracker.icon className="w-8 h-8 text-accent-primary" />
                <h2 className="ml-4 text-3xl font-bold text-text-primary">{tracker.name}</h2>
            </div>
            {children}
        </div>
    );
};

export default TrackerWrapper;