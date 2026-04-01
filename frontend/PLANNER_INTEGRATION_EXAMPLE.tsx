// Example integration of plannerService into the Planner component
// This shows how to add backend sync to the existing Planner.tsx

import React, { useState, useContext, useRef, useCallback, useEffect, useMemo } from 'react';
import { DataContext } from './src/context/DataContext';
import { TRACKERS } from './src/constants';
import TrackerWrapper from './src/components/TrackerWrapper';
import Button from './src/components/ui/Button';
import { v4 as uuidv4 } from 'uuid';
import { PlannerData, TodoBlock, Task } from './src/types';
import { plannerService } from './src/services/plannerService';

// Simple debounce implementation with cancel method
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T & { cancel: () => void } => {
    let timeout: NodeJS.Timeout;
    const debounced = ((...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }) as T & { cancel: () => void };
    
    debounced.cancel = () => {
        clearTimeout(timeout);
    };
    
    return debounced;
};

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
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

    // ==================== NEW: Load planner data from backend on mount ====================
    useEffect(() => {
        const loadPlannerData = async () => {
            try {
                const data = await plannerService.getPlanner();
                if (data) {
                    setPlannerData(data);
                }
            } catch (error) {
                console.error('Failed to load planner data:', error);
            }
        };

        loadPlannerData();
    }, []);

    // ==================== NEW: Auto-save to backend with debouncing ====================
    useEffect(() => {
        const syncToBackend = debounce(async () => {
            if (!plannerData) return;

            setIsSyncing(true);
            try {
                const success = await plannerService.syncPlanner(plannerData);
                if (success) {
                    setLastSyncTime(new Date());
                    console.log('Planner data synced successfully');
                }
            } catch (error) {
                console.error('Failed to sync planner data:', error);
            } finally {
                setIsSyncing(false);
            }
        }, 2000); // Wait 2 seconds after last change before syncing

        syncToBackend();

        return () => {
            syncToBackend.cancel();
        };
    }, [plannerData]);

    // ==================== NEW: Manual save button ====================
    const handleManualSave = async () => {
        setIsSyncing(true);
        try {
            const success = await plannerService.updatePlanner(plannerData);
            if (success) {
                setLastSyncTime(new Date());
                alert('Planner saved successfully!');
            } else {
                alert('Failed to save planner data');
            }
        } catch (error) {
            console.error('Failed to save planner:', error);
            alert('Error saving planner data');
        } finally {
            setIsSyncing(false);
        }
    };

    // ==================== EXISTING CODE (unchanged) ====================
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
            setInteractionState(prev => prev ? { ...prev, startX: e.clientX, startY: e.clientY } : null);
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

    const deleteBlock = async (id: string) => {
        // Optimistically update UI
        setPlannerData(prev => ({
            ...prev,
            blocks: prev.blocks.filter(b => b.id !== id),
            links: prev.links.filter(l => l.from !== id && l.to !== id)
        }));

        // ==================== NEW: Delete from backend ====================
        try {
            await plannerService.deleteBlock(id);
        } catch (error) {
            console.error('Failed to delete block from backend:', error);
            // Could add rollback logic here if needed
        }
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
        const map = new Map<string, { x: number, y: number }>();
        blocks.forEach(b => map.set(b.id, { x: b.x, y: b.y }));
        return map;
    }, [blocks]);

    const trackerInfo = TRACKERS.find(t => t.id === 'planner')!;

    // ==================== NEW: Format last sync time ====================
    const formatSyncTime = () => {
        if (!lastSyncTime) return 'Never';
        const now = new Date();
        const diff = Math.floor((now.getTime() - lastSyncTime.getTime()) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return `${Math.floor(diff / 3600)}h ago`;
    };

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
                {/* ==================== NEW: Sync status indicator ==================== */}
                <div className="flex items-center gap-2 bg-sidebar-bg px-3 py-1 rounded-lg text-sm">
                    {isSyncing ? (
                        <>
                            <span className="animate-spin">⟳</span>
                            <span>Syncing...</span>
                        </>
                    ) : (
                        <>
                            <span className="text-green-500">✓</span>
                            <span>Saved {formatSyncTime()}</span>
                        </>
                    )}
                </div>

                {/* ==================== NEW: Manual save button ==================== */}
                <Button onClick={handleManualSave} disabled={isSyncing}>
                    💾 Save
                </Button>

                <Button onClick={addBlock}>+ Add Block</Button>
                <div className="flex items-center gap-2 bg-sidebar-bg p-1 rounded-lg">
                    <button className="p-1" onClick={() => handleWheel({ deltaY: 100, clientX: window.innerWidth / 2, clientY: window.innerHeight / 2, preventDefault: () => { } } as React.WheelEvent)}>-</button>
                    <span className="w-12 text-center text-sm font-mono">{(transform.scale * 100).toFixed(0)}%</span>
                    <button className="p-1" onClick={() => handleWheel({ deltaY: -100, clientX: window.innerWidth / 2, clientY: window.innerHeight / 2, preventDefault: () => { } } as React.WheelEvent)}>+</button>
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

                    {/* blocks.map(block => (
                        <TodoBlockComponent
                            key={block.id}
                            block={block}
                            updateBlock={updateBlock}
                            deleteBlock={deleteBlock}
                            startLink={startLink}
                            finishLink={finishLink}
                            isLinking={!!linking}
                        />
                    )) */}
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

// TodoBlockComponent remains unchanged...
// (Include the existing TodoBlockComponent code here)

export default Planner;
