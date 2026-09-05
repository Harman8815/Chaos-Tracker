import React, { useState } from 'react';

const PedometerTool: React.FC = () => {
    const [steps, setSteps] = useState(0);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    
    const playSound = () => {
        let ctx = audioContext;
        if (!ctx) {
            try {
                ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                setAudioContext(ctx);
            } catch (e) {
                console.error("Web Audio API is not supported in this browser");
                return;
            }
        }
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        
        oscillator.start(ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        oscillator.stop(ctx.currentTime + 0.2);
    };

    const handleStep = () => {
        setSteps(s => s + 1);
        playSound();
    };

    const handleReset = () => {
        setSteps(0);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center text-white">
            <div 
                className="w-48 h-48 rounded-full border-8 border-accent-primary flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95"
                onClick={handleStep}
                role="button"
                aria-label="Increment step count"
            >
                <div className="text-5xl font-bold">{steps}</div>
                <div className="text-text-secondary">steps</div>
            </div>
            <button onClick={handleReset} className="mt-8 text-sm text-text-secondary hover:text-white underline">
                Reset
            </button>
        </div>
    );
};

export default PedometerTool;

