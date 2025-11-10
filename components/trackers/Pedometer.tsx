import React from 'react';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';

const Pedometer: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'pedometer')!;
    
    return (
        <TrackerWrapper tracker={trackerInfo}>
            <div className="flex items-center justify-center h-full">
                <p className="text-2xl text-text-secondary">Pedometer coming soon!</p>
            </div>
        </TrackerWrapper>
    );
};

export default Pedometer;