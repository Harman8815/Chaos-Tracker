import React, { useState, useContext, useRef, useCallback, useEffect, useMemo } from 'react';
import { DataContext } from '../../context/DataContext';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import Button from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';
import { PlannerData, TodoBlock, Task } from '../../types';

const MIN_SCALE = 0.2;
const MAX_SCALE = 2;

const Planner: React.FC = () => {
    const { plannerData, setPlannerData } = useContext(DataContext);
    const { blocks, links, transform } = plannerData;
    const canvasRef = useRef<HTMLDivElement>(null);
    const [interactionState, setInteractionState] = useState<{
        type: 'pan' | 'drag';
        blockId?: string;
        startX: number;
        startY: number;
    } | null>(null);

    const [linking, setLinking] = useState<{ from: string } | null>(null);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const { deltaY, clientX, clientY } = e;
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, transform.scale * (1 - deltaY * 0.001)));
        const scaleRatio = newScale / transform.scale;

        const newPanX = mouseX - (mouseX - transform.panX) * scaleRatio;
        const newPanY = mouseY - (mouseY - transform.panY) * scaleRatio;

        setPlannerData(prev => ({ ...prev, transform: { scale: newScale, panX: newPanX, panY: newPanY } }));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement;
        const blockElement = target.closest('[data-block-id]');
        const isDragger = target.closest('[data-dragger="true"]');

        if (blockElement && isDragger) {
            setInteractionState({
                type: 'drag',
                blockId: blockElement.getAttribute('data-block-id')!,
                startX: e.clientX,
                startY: e.clientY,
            });
        } else if (target === canvasRef.current || target.closest('[data-canvas-bg]')) {
             setInteractionState({
                type: 'pan',
                startX: e.clientX - transform.panX,
                startY: e.clientY - transform.panY,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!interactionState) return;
        
        if (interactionState.type === 'pan') {
            setPlannerData(prev => ({
                ...prev,
                transform: { ...prev.transform, panX: e.clientX - interactionState.startX, panY: e.clientY - interactionState.startY }
            }));
        } else if (interactionState.type === 'drag') {
            const dx = (e.clientX - interactionState.startX) / transform.scale;
            const dy = (e.clientY - interactionState.startY) / transform.scale;

            setPlannerData(prev => ({
                ...prev,
                blocks: prev.blocks.map(b =>
                    b.id === interactionState.blockId ? { ...b, x: b.x + dx, y: b.y + dy } : b
                )
            }));
            // Update start for next delta calculation
            setInteractionState(prev => prev ? {...prev, startX: e.clientX, startY: e.clientY } : null);
        }
    };

    const handleMouseUp = () => setInteractionState(null);

    const updateBlock = (id: string, updates: Partial<TodoBlock>) => {
        setPlannerData(prev => ({ ...prev, blocks: prev.blocks.map(b => b.id === id ? { ...b, ...updates } : b) }));
    };

    const addBlock = () => {
        const newBlock: TodoBlock = {
            id: uuidv4(),
            title: 'New Block',
            x: (Math.random() * 500 - transform.panX) / transform.scale,
            y: (Math.random() * 300 - transform.panY) / transform.scale,
            tasks: []
        };
        setPlannerData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    };

    const deleteBlock = (id: string) => {
         setPlannerData(prev => ({
            ...prev,
            blocks: prev.blocks.filter(b => b.id !== id),
            links: prev.links.filter(l => l.from !== id && l.to !== id)
        }));
    };
    
    const startLink = (from: string) => setLinking({ from });

    const finishLink = (to: string) => {
        if (linking && linking.from !== to) {
            const newLink = { id: uuidv4(), from: linking.from, to };
            setPlannerData(prev => ({ ...prev, links: [...prev.links, newLink] }));
        }
        setLinking(null);
    };

    const blockPositions = useMemo(() => {
        const map = new Map<string, {x: number, y: number}>();
        blocks.forEach(b => map.set(b.id, { x: b.x, y: b.y }));
        return map;
    }, [blocks]);

    const trackerInfo = TRACKERS.find(t => t.id === 'planner')!;

    return (
        <TrackerWrapper tracker={trackerInfo}>
             <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
                <Button onClick={addBlock}>+ Add Block</Button>
                <div className="flex items-center gap-2 bg-sidebar-bg p-1 rounded-lg">
                    <button className="p-1" onClick={() => handleWheel({ deltaY: 100, clientX: window.innerWidth / 2, clientY: window.innerHeight / 2, preventDefault: ()=>{} } as React.WheelEvent)}>-</button>
                    <span className="w-12 text-center text-sm font-mono">{(transform.scale * 100).toFixed(0)}%</span>
                    <button className="p-1" onClick={() => handleWheel({ deltaY: -100, clientX: window.innerWidth / 2, clientY: window.innerHeight / 2, preventDefault: ()=>{} } as React.WheelEvent)}>+</button>
                </div>
             </div>

            <div 
                ref={canvasRef}
                className={`relative w-full h-[calc(100vh-8rem)] bg-background border border-border overflow-hidden rounded-lg shadow-inner ${interactionState?.type === 'pan' ? 'cursor-grabbing' : 'cursor-grab'} ${linking ? 'cursor-crosshair' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <div data-canvas-bg className="absolute inset-0 bg-dots"></div>

                <div
                    className="absolute top-0 left-0 transition-transform duration-75 ease-linear"
                    style={{ transform: `translate(${transform.panX}px, ${transform.panY}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
                >
                    <svg className="absolute top-0 left-0 overflow-visible pointer-events-none">
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
                            </marker>
                        </defs>
                        {links.map(link => {
                            const fromPos = blockPositions.get(link.from);
                            const toPos = blockPositions.get(link.to);
                            if (!fromPos || !toPos) return null;
                            return <path key={link.id} d={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`} stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrow)" />;
                        })}
                    </svg>

                    {blocks.map(block => (
                        <TodoBlockComponent 
                            key={block.id} 
                            block={block} 
                            updateBlock={updateBlock}
                            deleteBlock={deleteBlock}
                            startLink={startLink}
                            finishLink={finishLink}
                            isLinking={!!linking}
                         />
                    ))}
                </div>
                 <style>{`
                    .bg-dots {
                        background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
                        background-size: 20px 20px;
                    }
                `}</style>
            </div>
        </TrackerWrapper>
    );
};

interface TodoBlockProps {
    block: TodoBlock;
    updateBlock: (id: string, updates: Partial<TodoBlock>) => void;
    deleteBlock: (id: string) => void;
    startLink: (from: string) => void;
    finishLink: (to: string) => void;
    isLinking: boolean;
}

const TodoBlockComponent: React.FC<TodoBlockProps> = ({ block, updateBlock, deleteBlock, startLink, finishLink, isLinking }) => {
    const [newTaskText, setNewTaskText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => updateBlock(block.id, { title: e.target.value });
    
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            const newTask: Task = { id: uuidv4(), text: newTaskText.trim(), completed: false };
            updateBlock(block.id, { tasks: [...block.tasks, newTask] });
            setNewTaskText('');
        }
    };
    
    const toggleTask = (taskId: string) => {
        const newTasks = block.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        updateBlock(block.id, { tasks: newTasks });
    };

    const deleteTask = (taskId: string) => {
        updateBlock(block.id, { tasks: block.tasks.filter(t => t.id !== taskId) });
    }

    return (
        <div
            data-block-id={block.id}
            onClick={() => isLinking && finishLink(block.id)}
            className={`absolute w-64 bg-card-bg rounded-lg shadow-lg border border-border transition-all duration-100 ease-in-out flex flex-col ${isLinking ? 'cursor-crosshair hover:border-accent-primary' : ''}`}
            style={{ top: block.y, left: block.x }}
        >
            <div data-dragger="true" className="p-2 bg-sidebar-bg rounded-t-lg flex justify-between items-center cursor-move">
                <input 
                    type="text" 
                    value={block.title} 
                    onChange={handleTitleChange} 
                    className="bg-transparent font-bold w-full focus:outline-none focus:bg-input-bg rounded px-1"
                    onMouseDown={e => e.stopPropagation()}
                />
                <div className="flex items-center">
                    <button onClick={(e)=>{ e.stopPropagation(); startLink(block.id);}} className="p-1 text-text-secondary hover:text-accent-primary" title="Link Block">🔗</button>
                    <button onClick={(e)=>{ e.stopPropagation(); deleteBlock(block.id);}} className="p-1 text-text-secondary hover:text-red-500" title="Delete Block">🗑️</button>
                </div>
            </div>
            <div className="p-2 space-y-2 max-h-60 overflow-y-auto">
                {block.tasks.map(task => (
                    <div key={task.id} className="flex items-center group">
                        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="mr-2 accent-accent-primary" />
                        <span className={`flex-grow text-sm ${task.completed ? 'line-through text-text-disabled' : ''}`}>{task.text}</span>
                        <button onClick={() => deleteTask(task.id)} className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">X</button>
                    </div>
                ))}
            </div>
            <form onSubmit={handleAddTask} className="p-2 border-t border-border">
                <input 
                    ref={inputRef}
                    type="text"
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    placeholder="+ Add a task"
                    className="w-full bg-input-bg text-sm px-2 py-1 rounded border border-transparent focus:outline-none focus:border-accent-primary"
                    onMouseDown={e => e.stopPropagation()}
                />
            </form>
        </div>
    );
}

export default Planner;
