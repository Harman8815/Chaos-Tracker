import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface DraggableResizableModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    initialSize?: { width: number; height: number };
    initialPosition?: { x: number; y: number };
    zIndex: number;
    onFocus: () => void;
}

const DraggableResizableModal: React.FC<DraggableResizableModalProps> = ({
    title,
    children,
    onClose,
    initialSize = { width: 400, height: 500 },
    initialPosition = { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 250 },
    zIndex,
    onFocus,
}) => {
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState(initialSize);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button, input, textarea, select')) return;
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            posX: position.x,
            posY: position.y,
        };
        onFocus();
    };

    const handleDrag = (e: MouseEvent) => {
        if (!isDragging || !dragStartRef.current) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        
        const newX = dragStartRef.current.posX + dx;
        const newY = dragStartRef.current.posY + dy;

        setPosition({
           x: Math.max(0, Math.min(newX, window.innerWidth - size.width)),
           y: Math.max(0, Math.min(newY, window.innerHeight - size.height)),
        });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        dragStartRef.current = null;
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDrag);
            window.addEventListener('mouseup', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
        };
    }, [isDragging]);

    return (
        <div
            ref={modalRef}
            className="fixed bg-[rgba(15,10,30,0.75)] backdrop-blur-xl border border-accent-primary/35 rounded-xl shadow-[0_0_25px_rgba(124,58,237,0.35)] flex flex-col animate-fade-in"
            style={{
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                zIndex,
            }}
            onMouseDown={onFocus}
        >
            <div
                className="h-12 bg-[rgba(15,10,30,0.65)] backdrop-blur-sm border-b border-accent-primary/35 rounded-t-xl flex items-center gap-2 px-4 cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleDragStart}
            >
                <GripVertical className="w-4 h-4 text-text-secondary" />
                <span className="font-bold text-white flex-1">{title}</span>
                <button
                    onClick={onClose}
                    className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold hover:bg-red-600"
                    aria-label="Close"
                >
                    &#x2715;
                </button>
            </div>
            <div className="flex-grow p-4 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default DraggableResizableModal;

