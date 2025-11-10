import React from 'react';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';

const QuoteCollector: React.FC = () => {
    const trackerInfo = TRACKERS.find(t => t.id === 'quotes')!;
    
    return (
        <TrackerWrapper tracker={trackerInfo}>
            <div className="flex items-center justify-center h-full">
                <p className="text-2xl text-text-secondary">Quote Collector coming soon!</p>
            </div>
        </TrackerWrapper>
    );
};

export default QuoteCollector;