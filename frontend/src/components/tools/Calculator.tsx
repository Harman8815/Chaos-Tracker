import React, { useState, useEffect, useRef } from 'react';

type FinanceKey = 'N' | 'IY' | 'PV' | 'PMT' | 'FV';

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [isFinanceMode, setIsFinanceMode] = useState(false);
    const [isComputing, setIsComputing] = useState(false);
    const [operation, setOperation] = useState<string | null>(null);
    const [showHelp, setShowHelp] = useState(false);

    const financeValues = useRef<Record<FinanceKey, number | null>>({ N: null, IY: null, PV: null, PMT: null, FV: null });

    const handleInput = (value: string) => {
        if (display.length >= 16) return;
        if (operation && !display.includes(' ')) {
             setDisplay(value);
        } else if (display === '0' && value !== '.') {
            setDisplay(value);
        } else if (value === '.' && display.includes('.')) {
            return;
        } else {
            setDisplay(display + value);
        }
    };
    
    const handleBackspace = () => {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    };

    const handleOperator = (op: string) => {
        if (/\s[+\-*/]\s$/.test(display)) return;
        setOperation(op);
        setDisplay(display + ` ${op} `);
    };

    const handleEquals = () => {
        try {
            const result = new Function('return ' + display.replace(/[^0-9+\-*/. ]/g, ''))();
            setDisplay(String(result));
            setOperation(null);
        } catch (e) {
            setDisplay('Error');
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setOperation(null);
    };
    
    const handleFinanceKey = (key: FinanceKey) => {
        if (isComputing) {
            computeFinance(key);
            setIsComputing(false);
        } else {
            const value = parseFloat(display);
            if (!isNaN(value)) {
                financeValues.current[key] = value;
                setDisplay('0');
                forceUpdate();
            }
        }
    };

    const computeFinance = (key: FinanceKey) => {
        const { N, IY, PV, PMT, FV } = financeValues.current;
        const r = IY !== null ? (IY / 100) / 12 : null;

        let result: number | string = 'Error';

        try {
            switch (key) {
                case 'PMT':
                    if (PV !== null && r !== null && N !== null) result = r === 0 ? -(PV + (FV || 0)) / N : -(PV * Math.pow(1 + r, N) + (FV || 0)) / ((Math.pow(1 + r, N) - 1) / r);
                    break;
                case 'PV':
                    if (PMT !== null && r !== null && N !== null) result = r === 0 ? -(FV || 0) - PMT * N : -((FV || 0) + PMT * (Math.pow(1 + r, N) - 1) / r) / Math.pow(1 + r, N);
                    break;
                case 'FV':
                     if (PV !== null && r !== null && N !== null) result = -(PV * Math.pow(1 + r, N) + (PMT || 0) * (Math.pow(1 + r, N) - 1) / (r || 1e-9));
                    break;
                case 'N':
                    if (PMT !== null && r !== null && PV !== null) result = r === 0 ? -(PV + (FV || 0)) / PMT : Math.log((PMT - (FV || 0) * r) / (PMT + PV * r)) / Math.log(1 + r);
                    break;
                case 'IY':
                    result = 'Auto I/Y not supported';
                    break;
            }
             financeValues.current[key] = typeof result === 'number' ? result : null;
            setDisplay(typeof result === 'number' ? result.toFixed(2) : result);
        } catch {
             setDisplay('Math Error');
        }
    };
    
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).closest('input, textarea')) return;
            e.preventDefault();
            const key = e.key;
            if (key >= '0' && key <= '9' || key === '.') handleInput(key);
            if (['+', '-', '*', '/'].includes(key)) handleOperator(key);
            if (key === 'Enter' || key === '=') handleEquals();
            if (key === 'Escape') handleClear();
            if (key === 'Backspace') handleBackspace();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [display, operation]);

    const HelpOverlay = () => (
        <div className="absolute inset-0 bg-card-bg/95 backdrop-blur-sm p-4 z-10 flex flex-col animate-fade-in text-sm text-text-secondary">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-text-primary">Calculator Help</h3>
                <button onClick={() => setShowHelp(false)} className="w-8 h-8 rounded-full bg-input-bg flex items-center justify-center hover:bg-border text-lg">&times;</button>
            </div>
            <div className="overflow-y-auto space-y-4 pr-2 -mr-2">
                <div>
                    <h4 className="font-bold text-text-primary mb-1">General Use</h4>
                    <p>Use your mouse or keyboard for input. Supported keys: `0-9`, `.`, `+`, `-`, `*`, `/`, `Enter` (=), `Backspace`, `Escape` (AC).</p>
                </div>
                <div>
                    <h4 className="font-bold text-text-primary mb-1">Standard Mode</h4>
                    <p>`AC` (All Clear): Resets the calculation. `C` (Backspace): Deletes the last character.</p>
                </div>
                 <div>
                    <h4 className="font-bold text-text-primary mb-1">Finance Mode</h4>
                    <p>A Time Value of Money (TVM) solver. Enter known values first, then compute the unknown.</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><b>To Store a Value:</b> Type a number, then press a finance key (N, IY, etc.).</li>
                        <li><b>To Compute a Value:</b> Press `CMPT`, then press the key for the value you want to calculate.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-text-primary mb-1">Finance Keys</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><b>N:</b> Total number of payment periods.</li>
                        <li><b>I/Y:</b> Annual interest rate (e.g., enter 5 for 5%).</li>
                        <li><b>PV:</b> Present Value (e.g., loan amount).</li>
                        <li><b>PMT:</b> Payment per period.</li>
                        <li><b>FV:</b> Future Value.</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderStandardButtons = () => (
        <div className="grid grid-cols-4 gap-2">
            <button title="All Clear: Resets the calculator" onClick={handleClear} className="col-span-2 bg-red-500/50 hover:bg-red-500/70 backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-red-400/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">AC</button>
            <button title="Backspace: Deletes the last character" onClick={handleBackspace} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">C</button>
            <button title="Divide" onClick={() => handleOperator('/')} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">/</button>
            {'789'.split('').map(n => <button key={n} title={`Number ${n}`} onClick={() => handleInput(n)} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">{n}</button>)}
            <button title="Multiply" onClick={() => handleOperator('*')} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">*</button>
            {'456'.split('').map(n => <button key={n} title={`Number ${n}`} onClick={() => handleInput(n)} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">{n}</button>)}
            <button title="Subtract" onClick={() => handleOperator('-')} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">-</button>
            {'123'.split('').map(n => <button key={n} title={`Number ${n}`} onClick={() => handleInput(n)} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">{n}</button>)}
            <button title="Add" onClick={() => handleOperator('+')} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">+</button>
            <button title="Number 0" onClick={() => handleInput('0')} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">0</button>
            <button title="Decimal Point" onClick={() => handleInput('.')} className="bg-sidebar-bg/60 hover:bg-border backdrop-blur-sm border border-white/5 p-3 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">.</button>
            <button title="Equals: Calculate the result" onClick={handleEquals} className="col-span-2 bg-accent-primary hover:bg-accent-primary-dark backdrop-blur-sm border border-accent-primary/50 p-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">=</button>
        </div>
    );
    
    const renderFinanceButtons = () => (
        <div className="grid grid-cols-3 gap-2 text-sm flex-grow">
            <button title="Number of Periods" onClick={() => handleFinanceKey('N')} className="bg-input-bg hover:bg-border backdrop-blur-sm border border-white/5 p-2 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">N</button>
            <button title="Interest Rate per Year" onClick={() => handleFinanceKey('IY')} className="bg-input-bg hover:bg-border backdrop-blur-sm border border-white/5 p-2 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">I/Y</button>
            <button title="Present Value" onClick={() => handleFinanceKey('PV')} className="bg-input-bg hover:bg-border backdrop-blur-sm border border-white/5 p-2 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">PV</button>
            <button title="Payment per Period" onClick={() => handleFinanceKey('PMT')} className="bg-input-bg hover:bg-border backdrop-blur-sm border border-white/5 p-2 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">PMT</button>
            <button title="Future Value" onClick={() => handleFinanceKey('FV')} className="bg-input-bg hover:bg-border backdrop-blur-sm border border-white/5 p-2 rounded-lg transition-all duration-200 hover:border-accent-primary/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]">FV</button>
            <button title="Compute: Press this, then the key for the value to solve." onClick={() => setIsComputing(true)} className={`p-2 rounded-lg ${isComputing ? 'bg-green-500 animate-pulse' : 'bg-accent-primary hover:bg-accent-primary-dark backdrop-blur-sm border border-accent-primary/50 transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}>CMPT</button>
        </div>
    );
    
    const renderFinanceDisplay = () => (
        <div className="grid grid-cols-5 gap-1 text-center text-xs text-text-secondary mb-2">
            {(['N', 'IY', 'PV', 'PMT', 'FV'] as FinanceKey[]).map(key => (
                <div key={key} className="bg-sidebar-bg/50 p-1 rounded">
                    <div className="font-bold">{key}</div>
                    <div>{financeValues.current[key]?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? '-'}</div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="relative h-full flex flex-col font-mono text-text-primary text-lg bg-card-bg/80 backdrop-blur-xl border border-accent-primary/30 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.15)] p-3">
             {showHelp && <HelpOverlay />}
             <div className="flex justify-end items-center mb-1">
                <button 
                    onClick={() => setShowHelp(true)} 
                    className="w-6 h-6 rounded-full border border-text-secondary text-text-secondary flex items-center justify-center text-sm font-bold hover:bg-border hover:text-text-primary mr-3"
                    title="Show Help"
                >
                    i
                </button>
                <span className="text-xs mr-2">Finance Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isFinanceMode} onChange={() => setIsFinanceMode(!isFinanceMode)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-input-bg rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                </label>
             </div>
            {isFinanceMode && renderFinanceDisplay()}
            <div className="bg-background/60 backdrop-blur-md border border-accent-primary/20 rounded-xl p-3 text-right text-3xl mb-2 break-words h-16 flex items-end justify-end shadow-[0_0_15px_rgba(99,102,241,0.1)]">{display}</div>
            <div className="flex-grow flex flex-col">
                {isFinanceMode ? renderFinanceButtons() : renderStandardButtons()}
            </div>
        </div>
    );
};
export default Calculator;
