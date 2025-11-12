import React, { useState, useEffect } from 'react';

const AnalogClock: React.FC<{ time: Date }> = ({ time }) => {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDeg = (seconds / 60) * 360;
    const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

    return (
        <div className="w-64 h-64 rounded-full bg-sidebar-bg border-4 border-border relative mx-auto my-4">
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>
            <div className="absolute top-1/2 left-1/2 h-20 w-1 bg-text-primary origin-bottom -translate-x-1/2 -translate-y-full" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
            <div className="absolute top-1/2 left-1/2 h-28 w-0.5 bg-text-secondary origin-bottom -translate-x-1/2 -translate-y-full" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
            <div className="absolute top-1/2 left-1/2 h-28 w-px bg-red-500 origin-bottom -translate-x-1/2 -translate-y-full" style={{ transform: `rotate(${secondDeg}deg)` }}></div>
        </div>
    );
};

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [isAnalog, setIsAnalog] = useState(false);

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center text-text-primary">
             <div className="absolute top-4 right-4 flex justify-end items-center mb-2">
                <span className="text-xs mr-2">Analog</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isAnalog} onChange={() => setIsAnalog(!isAnalog)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-input-bg rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                </label>
             </div>

            {isAnalog ? (
                <AnalogClock time={time} />
            ) : (
                <div className="font-mono text-6xl tracking-widest">
                    {time.toLocaleTimeString()}
                </div>
            )}
            <p className="text-lg text-text-secondary mt-4">
                {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    );
};

export default Clock;
