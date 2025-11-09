import React, { useContext, useState, useEffect } from 'react';
// FIX: Corrected import path for context.
import { DataContext, SettingsContext } from '../App';
import { getAIPoweredSummary } from '../services/geminiService';
import Card from './ui/Card';
import Button from './ui/Button';

// A simple line chart component
const LineChart = ({ data, label }: { data: {x: string, y: number}[], label: string }) => {
    if (!data || data.length === 0) {
        return <div className="text-center p-4">Not enough data to display chart.</div>;
    }

    const width = 500;
    const height = 200;
    const padding = 40;
    
    const maxX = data.length - 1;
    const maxY = 10; // Daily score is out of 10

    const getX = (val: number) => padding + (val / maxX) * (width - 2 * padding);
    const getY = (val: number) => height - padding - (val / maxY) * (height - 2 * padding);

    const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.y)}`).join(' ');

    const yAxisLabels = Array.from({ length: 6 }, (_, i) => i * 2);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Y-axis */}
            {yAxisLabels.map(val => (
                <g key={val}>
                    <text x={padding - 10} y={getY(val)} dy="0.3em" textAnchor="end" className="text-xs fill-current text-text-secondary">{val}</text>
                    <line x1={padding} x2={width-padding} y1={getY(val)} y2={getY(val)} className="stroke-current text-text-disabled opacity-20" />
                </g>
            ))}

            {/* X-axis */}
            {data.map((p, i) => ( i % 5 === 0 &&
                <text key={i} x={getX(i)} y={height - padding + 15} textAnchor="middle" className="text-xs fill-current text-text-secondary">
                    {new Date(p.x).getDate()}
                </text>
            ))}

            <path d={linePath} strokeWidth="2" fill="none" className="stroke-current text-accent-primary" />
            
            {data.map((p, i) => (
                <circle key={i} cx={getX(i)} cy={getY(p.y)} r="3" fill="white" className="stroke-current text-accent-primary" strokeWidth="2" />
            ))}
            <text x={width/2} y={20} textAnchor="middle" className="font-bold fill-current text-text-primary">{label}</text>
        </svg>
    );
}

const Loader: React.FC = () => (
    <div className="flex items-center justify-center w-full h-full">
        <div className="w-6 h-6 border-4 border-input-bg rounded-full border-t-accent-primary animate-spin"></div>
    </div>
);


const Dashboard: React.FC = () => {
    const { data } = useContext(DataContext);
    const { settings } = useContext(SettingsContext);
    const [summary, setSummary] = useState('Generating reflection...');
    const [isLoading, setIsLoading] = useState(true);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleGenerateSummary = () => {
        setIsLoading(true);
        getAIPoweredSummary(data).then(res => {
            setSummary(res);
            setIsLoading(false);
        });
    };

    useEffect(handleGenerateSummary, [data]);

    const last30DaysScores = Object.entries(data)
        .map(([date, dailyData]) => ({ date, score: dailyData.points || 0 }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30)
        .map(d => ({ x: d.date, y: d.score }));

    return (
        <div className="p-6 h-full overflow-y-auto animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <h3 className="font-bold text-xl mb-4">Daily Score (Last 30 Days)</h3>
                    <LineChart data={last30DaysScores} label="Daily Score (out of 10)" />
                </Card>

                <div className="flex flex-col gap-6">
                    <Card className="flex-grow flex flex-col items-center justify-center">
                        <h3 className="font-bold text-xl mb-2">Current Time</h3>
                        <p className="text-5xl font-mono">
                            {time.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: settings.timeFormat === '12h'
                            })}
                        </p>
                    </Card>

                    <Card className="flex-grow">
                        <h3 className="font-bold text-xl mb-2">AI Daily Reflection</h3>
                        <div className="text-text-secondary mb-4 min-h-[60px] flex items-center justify-center">
                            {isLoading ? <Loader /> : <p className="w-full">{summary}</p>}
                        </div>
                        <Button onClick={handleGenerateSummary} disabled={isLoading}>
                            {isLoading ? 'Regenerating...' : 'Regenerate'}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;