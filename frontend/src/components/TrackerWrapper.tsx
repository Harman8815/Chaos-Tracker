import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
// FIX: Corrected import path for types.
import { Tracker } from '../types';

interface TrackerWrapperProps {
    tracker: Tracker;
    children: React.ReactNode;
}

const TrackerWrapper: React.FC<TrackerWrapperProps> = ({ tracker, children }) => {
    const { t } = useContext(SettingsContext);
    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-white/[0.06] glass-subtle">
                    <tracker.icon className="w-6 h-6 text-accent-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white">{t(tracker.id)}</h2>
            </div>
            {children}
        </div>
    );
};

export default TrackerWrapper;

