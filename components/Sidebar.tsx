import React, { useContext, useMemo, useRef, useEffect, useState } from 'react';
import { DataContext, SettingsContext } from '../App';
import { TRACKERS } from '../constants';
import { PageId } from '../types';

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
);
const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);


const Sidebar: React.FC = () => {
    const { selectedPage, setSelectedPage } = useContext(DataContext);
    const { setIsSettingsModalOpen } = useContext(SettingsContext);
    const [indicatorPosition, setIndicatorPosition] = useState(0);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // FIX: Create a discriminated union by ensuring all nav items have a 'type' property.
    // This resolves TypeScript errors when accessing `item.type`.
    const navItems = useMemo(() => [
        { type: 'item' as const, id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
        ...TRACKERS.map(tracker => ({ ...tracker, type: 'item' as const })),
        { type: 'divider' as const, id: 'divider' },
        { type: 'item' as const, id: 'home', name: 'Home', icon: HomeIcon },
    ], []);


    useEffect(() => {
        // Find the correct index while skipping dividers
        const selectedIndex = navItems.filter(item => item.type !== 'divider').findIndex(item => item.id === selectedPage);
        const selectedItem = itemRefs.current[selectedIndex];
        if (selectedItem) {
            setIndicatorPosition(selectedItem.offsetTop);
        }
    }, [selectedPage, navItems]);
    

    const handleSelect = (id: PageId) => {
        if (id === 'settings') {
            setIsSettingsModalOpen(true);
        } else {
            setSelectedPage(id);
        }
    };
    
    return (
        <aside className="w-24 bg-sidebar-bg flex flex-col items-center justify-between py-6 shadow-2xl">
            <div className="relative flex flex-col items-center space-y-4">
                <div 
                    className="absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-accent-primary rounded-2xl transition-all duration-500 ease-in-out"
                    style={{ 
                        transform: `translateY(${indicatorPosition}px) translateX(-50%)`,
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)'
                    }} 
                />
                
                {navItems.map((item) => {
                    if (item.type === 'divider') {
                        return <div key={item.id} className="h-4" />;
                    }
                    const isSelected = selectedPage === item.id;
                    // We need to keep a clean index for the refs array, so we filter out dividers.
                    const refIndex = navItems.filter(i => i.type !== 'divider').findIndex(i => i.id === item.id);
                    return (
                        <button
                            key={item.id}
                            ref={el => { if (refIndex !== -1) itemRefs.current[refIndex] = el; }}
                            onClick={() => handleSelect(item.id as PageId)}
                            className={`relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ease-in-out focus:outline-none group z-10 ${isSelected ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}
                            aria-label={item.name}
                            aria-current={isSelected}
                        >
                            <item.icon className={`w-7 h-7 transition-transform duration-300 ease-in-out ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
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
        </aside>
    );
};

export default Sidebar;