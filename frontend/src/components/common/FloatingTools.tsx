import React, { useState } from 'react';
import { useTools } from '../ToolsProvider';
import { ToolId } from '../../types';

// Icons for the tools
const CalculatorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="12" y1="10" x2="12" y2="18"/><line x1="8" y1="10" x2="8" y2="18"/></svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const tools: { id: ToolId; icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }[] = [
    { id: 'calculator', icon: CalculatorIcon, label: 'Calculator' },
    { id: 'clock', icon: ClockIcon, label: 'Clock' },
    { id: 'chat', icon: ChatIcon, label: 'AI Assistant' },
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
                <div className="flex flex-col items-center space-y-3 mb-4 z-[999]">
                    {tools.map((tool, index) => (
                        <button
                            key={tool.id}
                            onClick={() => handleToolClick(tool.id)}
                            className="w-14 h-14 rounded-full bg-card-bg border border-border text-text-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-accent-primary animate-fade-in"
                            style={{ animationDelay: `${(tools.length - index) * 50}ms`}}
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
                <PlusIcon className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
            </button>
        </div>
    );
};

export default FloatingTools;
