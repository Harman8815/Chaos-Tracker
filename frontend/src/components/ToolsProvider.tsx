import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ToolId } from '../types';

interface ToolsContextType {
    openTools: ToolId[];
    openTool: (toolId: ToolId) => void;
    closeTool: (toolId: ToolId) => void;
    focusTool: (toolId: ToolId) => void;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const useTools = () => {
    const context = useContext(ToolsContext);
    if (!context) {
        throw new Error('useTools must be used within a ToolsProvider');
    }
    return context;
};

export const ToolsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [openTools, setOpenTools] = useState<ToolId[]>([]);

    const openTool = (toolId: ToolId) => {
        setOpenTools(prev => {
            if (prev.includes(toolId)) {
                // If already open, bring to front
                return [...prev.filter(t => t !== toolId), toolId];
            }
            return [...prev, toolId];
        });
    };

    const closeTool = (toolId: ToolId) => {
        setOpenTools(prev => prev.filter(t => t !== toolId));
    };
    
    const focusTool = (toolId: ToolId) => {
         setOpenTools(prev => {
            if (prev.includes(toolId) && prev[prev.length - 1] !== toolId) {
                // Bring to front
                return [...prev.filter(t => t !== toolId), toolId];
            }
            return prev;
        });
    };

    return (
        <ToolsContext.Provider value={{ openTools, openTool, closeTool, focusTool }}>
            {children}
        </ToolsContext.Provider>
    );
};
