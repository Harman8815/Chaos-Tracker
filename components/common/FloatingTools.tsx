import React, { useState } from 'react';
import { useTools } from '../ToolsProvider';
import { ToolId } from '../../types';

// Icons for the tools
const CalculatorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="12" y1="10" x2="12" y2="18"/><line x1="8" y1="10" x2="8" y2="18"/></svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const PedometerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 16.85V18a2 2 0 0 0 2 2h2.22a2 2 0 0 0 1.9-1.06l.7-1.4a2 2 0 0 1 3.8 0l.7 1.4a2 2 0 0 0 1.9 1.06H18a2 2 0 0 0 2-2v-1.15a2 2 0 0 0-1.06-1.9l-1.4-.7a2 2 0 0 1 0-3.8l1.4-.7A2 2 0 0 0 20 6.15V5a2 2 0 0 0-2-2h-2.22a2 2 0 0 0-1.9 1.06l-.7 1.4a2 2 0 0 1-3.8 0l-.7-1.4A2 2 0 0 0 7.22 3H5a2 2 0 0 0-2 2v1.15a2 2 0 0 0 1.06 1.9l1.4.7a2 2 0 0 1 0 3.8l-1.4-.7A2 2 0 0 0 4 16.85z"/></svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const tools: { id: ToolId; icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }[] = [
    { id: 'calculator', icon: CalculatorIcon, label: 'Calculator' },
    { id: 'clock', icon: ClockIcon, label: 'Clock' },
    { id: 'pedometer', icon: PedometerIcon, label: 'Pedometer' },
];

const FloatingTools: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { openTool } = useTools();

    const handleToolClick = (toolId: ToolId) => {
        openTool(toolId);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isOpen && (
                <div className="flex flex-col items-center space-y-3 mb-4">
                    {tools.map((tool, index) => (
                        <button
                            key={tool.id}
                            onClick={() => handleToolClick(tool.id)}
                            className="w-14 h-14 rounded-full bg-card-bg border border-border text-text-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-accent-primary animate-fade-in"
                            style={{ animationDelay: `${(tools.length - index) * 50}ms`, opacity: 0 }}
                            title={tool.label}
                            aria-label={tool.label}
                        >
                            <tool.icon className="w-6 h-6" />
                        </button>
                    ))}
                </div>
            )}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="w-16 h-16 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary focus:ring-offset-background"
                aria-label={isOpen ? "Close tools menu" : "Open tools menu"}
                aria-expanded={isOpen}
            >
                <PlusIcon className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
            </button>
        </div>
    );
};

export default FloatingTools;
