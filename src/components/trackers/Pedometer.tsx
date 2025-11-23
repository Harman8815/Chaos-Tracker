import React from 'react';
// FIX: The 'pedometer' tracker has been removed from the application's core types, causing a type error.
// As this component is unused, the dependency on TrackerWrapper is removed and its layout is replicated
// directly to resolve the compilation error while preserving the placeholder content.
// import { TRACKERS } from '../../constants';
// import TrackerWrapper from '../TrackerWrapper';

const Pedometer: React.FC = () => {
    // This line caused the error because 'pedometer' is no longer a valid PageId.
    // const trackerInfo = TRACKERS.find(t => t.id === 'pedometer')!;
    
    return (
        <div className="p-6 h-full overflow-y-auto animate-fade-in">
            <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-accent-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <h2 className="ml-4 text-3xl font-bold text-text-primary">Pedometer</h2>
            </div>
            <div className="flex items-center justify-center h-full">
                <p className="text-2xl text-text-secondary">Pedometer coming soon!</p>
            </div>
        </div>
    );
};

export default Pedometer;
