import React, { useContext, useMemo, useRef, useLayoutEffect, useState } from 'react';
import { DataContext, SettingsContext } from '../App';
import { TRACKERS } from '../constants';
import { PageId, Tracker } from '../types';

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
);
const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const Sidebar: React.FC = () => {
    const { selectedPage, setSelectedPage } = useContext(DataContext);
    const { setIsSettingsModalOpen } = useContext(SettingsContext);
    const [indicatorY, setIndicatorY] = useState(0);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = useMemo(() => {
        const allPossibleItems: (Tracker | { id: PageId; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; })[] = [
            { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
            ...TRACKERS,
            { id: 'home', name: 'Home', icon: HomeIcon },
        ];
        
        const orderedIds: PageId[] = ['dashboard', 'planner', 'home', 'points', 'journal'];

        return orderedIds.map(id => {
            const item = allPossibleItems.find(i => i.id === id);
            return item ? { ...item, type: 'item' as const } : null;
        }).filter(Boolean) as ({ id: PageId; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; type: 'item' })[];
    }, []);

    useLayoutEffect(() => {
        if (isCollapsed) return;
        const selectedIndex = navItems.findIndex(item => item.id === selectedPage);
        const selectedItem = itemRefs.current[selectedIndex];
        if (selectedItem) {
            // Calculate the absolute center of the selected button relative to its container.
            // This is more robust and serves as the single source of truth for positioning.
            const newIndicatorY = selectedItem.offsetTop + selectedItem.offsetHeight / 2;
            setIndicatorY(newIndicatorY-300);
        }
    }, [selectedPage, navItems, isCollapsed]);

    const handleSelect = (id: PageId) => {
        if (id === 'settings') {
            setIsSettingsModalOpen(true);
        } else {
            setSelectedPage(id);
        }
    };
    
    if (isCollapsed) {
        return (
            <button
                onClick={() => setIsCollapsed(false)}
                className="absolute top-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-sidebar-bg shadow-lg transition-all duration-300 ease-in-out text-text-secondary hover:text-text-primary focus:outline-none group animate-fade-in"
                aria-label="Open menu"
            >
                <MenuIcon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
            </button>
        );
    }
    
    // Define heights as constants to ensure calculations and styles are always in sync.
    const bulgeHeight = 80; // Corresponds to h-20
    const highlightHeight = 64; // Corresponds to h-16

    return (
        <aside className="relative bg-sidebar-bg flex flex-col items-center shadow-2xl transition-all duration-300 ease-in-out w-24 py-6 animate-fade-in z-20">
            <button
                onClick={() => setIsCollapsed(true)}
                className="flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ease-in-out text-text-secondary hover:text-text-primary focus:outline-none group mb-4"
                aria-label="Close menu"
            >
                <MenuIcon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
            </button>
            
            <div className="flex flex-col items-center justify-between h-full w-full">
                <div className="relative flex flex-col items-center justify-center space-y-4 flex-grow w-full">
                    {/* Sidebar Bulge */}
                    <div
                        className="absolute top-0 right-0 w-8 bg-sidebar-bg rounded-l-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg z-0"
                        style={{
                            height: `${bulgeHeight}px`,
                            // To center the bulge on indicatorY, we translate it up by half its height.
                            transform: `translateY(${indicatorY - bulgeHeight / 2}px)`,
                        }}
                    />

                    {/* Circular Highlight */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-16 bg-accent-primary/20 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{
                            height: `${highlightHeight}px`,
                            // To center the highlight on indicatorY, we translate it up by half its height.
                            transform: `translateY(${indicatorY - highlightHeight / 2}px) translateX(-50%)`,
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                        }}
                    />
                    
                    {navItems.map((item, index) => {
                        const isSelected = selectedPage === item.id;
                        return (
                            <button
                                key={item.id}
                                ref={el => { itemRefs.current[index] = el; }}
                                onClick={() => handleSelect(item.id as PageId)}
                                className={`relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ease-in-out focus:outline-none group z-10 ${isSelected ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}
                                aria-label={item.name}
                                aria-current={isSelected}
                            >
                                <item.icon className={`w-7 h-7 transition-transform duration-300 ease-in-out ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`} />
                            </button>
                        )
                    })}
                </div>

                <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ease-in-out text-text-secondary hover:text-text-primary focus:outline-none group"
                    aria-label="Settings"
                >
                    <SettingsIcon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
