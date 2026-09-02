import React, { useState } from 'react';
import { useTools } from '../ToolsProvider';
import { ToolId } from '../../types';
import { Calculator, Clock, MessageCircle, Plus } from 'lucide-react';

const tools: { id: ToolId; icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }[] = [
    { id: 'calculator', icon: Calculator, label: 'Calculator' },
    { id: 'clock', icon: Clock, label: 'Clock' },
    { id: 'chat', icon: MessageCircle, label: 'AI Assistant' },
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
                <Plus className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
            </button>
        </div>
    );
};

export default FloatingTools;
