import React, { useContext, useMemo, useRef, useEffect, useState } from 'react';
// FIX: Corrected import paths for context and types.
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
    const [wavePosition, setWavePosition] = useState(0);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const mainNavItems = useMemo(() => {
        const topItems = [
            { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
            ...TRACKERS.slice(0, 1),
        ];
        const bottomItems = [
             ...TRACKERS.slice(1),
        ];
        return { topItems, bottomItems };
    }, []);

    const allNavItems = useMemo(() => [
        ...mainNavItems.topItems,
        { id: 'home', name: 'Home', icon: HomeIcon },
        ...mainNavItems.bottomItems
    ], [mainNavItems]);

    useEffect(() => {
        const selectedIndex = allNavItems.findIndex(item => item.id === selectedPage);
        const selectedItem = itemRefs.current[selectedIndex];
        if (selectedItem) {
            setWavePosition(selectedItem.offsetTop);
        }
    }, [selectedPage, allNavItems]);

    const handleSelect = (id: PageId) => {
        if (id === 'settings') {
            setIsSettingsModalOpen(true);
        } else {
            setSelectedPage(id);
        }
    };
    
    const NavButton = ({ item, index }: { item: { id: string, name: string, icon: React.FC<any>}, index: number }) => {
        const isSelected = selectedPage === item.id;
        return (
            <button
                ref={el => { itemRefs.current[index] = el; }}
                onClick={() => handleSelect(item.id as PageId)}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ease-in-out focus:outline-none group ${isSelected ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
                aria-label={item.name}
                aria-current={isSelected}
            >
                <item.icon className={`w-7 h-7 transition-transform duration-300 ease-in-out ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
            </button>
        );
    }

    return (
        <aside className="w-24 bg-sidebar-bg flex flex-col items-center justify-between py-6">
             <div className="relative flex flex-col items-center space-y-4">
                <div 
                    className="absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-background rounded-2xl transition-all duration-500 ease-in-out"
                    style={{ 
                        transform: `translateY(${wavePosition - 4}px) translateX(-50%)`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }} 
                />
                
                <div className="flex flex-col items-center space-y-4">
                    {mainNavItems.topItems.map((item, i) => <NavButton key={item.id} item={item} index={i} />)}
                </div>

                <div className="my-4">
                    <NavButton item={{id: 'home', name: 'Home', icon: HomeIcon}} index={mainNavItems.topItems.length} />
                </div>

                <div className="flex flex-col items-center space-y-4">
                    {mainNavItems.bottomItems.map((item, i) => <NavButton key={item.id} item={item} index={mainNavItems.topItems.length + 1 + i} />)}
                </div>
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