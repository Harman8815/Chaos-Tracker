import React from 'react';
import { Activity } from 'lucide-react';

const Pedometer: React.FC = () => {
    return (
        <div className="p-6 h-full overflow-y-auto animate-fade-in">
            <div className="flex items-center mb-6">
                <Activity className="w-8 h-8 text-accent-primary" />
                <h2 className="ml-4 text-3xl font-bold text-text-primary">Pedometer</h2>
            </div>
            <div className="flex items-center justify-center h-full">
                <p className="text-2xl text-text-secondary">Pedometer coming soon!</p>
            </div>
        </div>
    );
};

export default Pedometer;
