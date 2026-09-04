import React, { useState, useEffect } from 'react';

const AnalogClock: React.FC<{ time: Date; onToggleView: () => void }> = ({ time, onToggleView }) => {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDeg = (seconds / 60) * 360;
    const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

    return (
        <div 
            className="w-64 h-64 rounded-full bg-[rgba(15,10,30,0.75)] backdrop-blur-xl border-4 border-[rgba(139,92,246,0.35)] relative mx-auto my-4 cursor-pointer select-none shadow-[0_0_30px_rgba(124,58,237,0.35)]"
            onClick={onToggleView}
            title="Switch to Digital View"
        >
            {/* Ticks and Numbers */}
            {Array.from({ length: 12 }, (_, i) => {
                const hour = i + 1;
                const angle = hour * 30;
                const isMajor = hour % 3 === 0;
                
                return (
                    <div
                        key={hour}
                        className="absolute w-full h-full flex justify-center"
                        style={{ transform: `rotate(${angle}deg)` }}
                    >
                        {isMajor ? (
                            <span 
                                className="absolute text-xl font-bold"
                                style={{ top: '15px', transform: `rotate(-${angle}deg)` }} 
                            >
                                {hour}
                            </span>
                        ) : (
                            <div className="absolute top-3 h-2 w-0.5 bg-text-secondary"></div>
                        )}
                    </div>
                );
            })}
            
            {/* Hands */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>
            <div className="absolute top-1/2 left-1/2 h-16 w-1 bg-text-primary origin-bottom -translate-x-1/2 -translate-y-full" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
            <div className="absolute top-1/2 left-1/2 h-24 w-0.5 bg-text-secondary origin-bottom -translate-x-1/2 -translate-y-full" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
            <div className="absolute top-1/2 left-1/2 h-24 w-px bg-red-500 origin-bottom -translate-x-1/2 -translate-y-full" style={{ transform: `rotate(${secondDeg}deg)` }}></div>
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

    const toggleView = () => setIsAnalog(prev => !prev);

    return (
        <div className="h-full flex flex-col items-center justify-center text-white">
            {isAnalog ? (
                <AnalogClock time={time} onToggleView={toggleView} />
            ) : (
                <div 
                    className="font-mono text-6xl tracking-widest cursor-pointer bg-[rgba(15,10,30,0.75)] backdrop-blur-xl border border-[rgba(139,92,246,0.35)] rounded-2xl px-8 py-4 shadow-[0_0_25px_rgba(124,58,237,0.35)] text-white"
                    onClick={toggleView}
                    title="Switch to Analog View"
                >
                    {time.toLocaleTimeString()}
                </div>
            )}
            <p className="text-lg text-[#e9d5ff] mt-4">
                {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    );
};

export default Clock;