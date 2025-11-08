import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataContext, SettingsContext } from '../App';
import { TRACKERS } from '../constants';
import type { PageId } from '../types';

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.73l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2.73l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

const NavButton = ({ item, isSelected, onClick }: { item: { id: PageId, name: string, icon: React.ReactElement }, isSelected: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 group
        ${ isSelected
            ? 'text-white'
            : 'text-light-text-secondary dark:text-text-secondary hover:bg-light-border-color dark:hover:bg-border-color'
        }`}
        aria-label={item.name}
        aria-current={isSelected}
        data-pageid={item.id}
    >
        <div className={`transition-transform duration-300 transform group-hover:scale-110 ${isSelected ? 'scale-110' : ''}`}>
            {item.icon}
        </div>
    </button>
);


const Sidebar: React.FC = () => {
    const dataContext = useContext(DataContext);
    const settingsContext = useContext(SettingsContext);

    const navContainerRef = useRef<HTMLDivElement>(null);
    const [indicatorTop, setIndicatorTop] = useState<number | null>(null);

    if (!dataContext || !settingsContext) return null;

    const { selectedPage, setSelectedPage } = dataContext;
    const { setIsSettingsOpen } = settingsContext;
    
    const allNavItems = [
        { id: 'dashboard' as PageId, name: 'Dashboard', icon: <DashboardIcon /> },
        ...TRACKERS,
        { id: 'home' as PageId, name: 'Home', icon: <HomeIcon /> },
    ];

    useEffect(() => {
        if (navContainerRef.current) {
            const activeButton = navContainerRef.current.querySelector(`[data-pageid="${selectedPage}"]`) as HTMLElement;
            if (activeButton) {
                // The wave is h-16, button is h-14, so offset by 2px to center.
                setIndicatorTop(activeButton.offsetTop - 2);
            }
        }
    }, [selectedPage]);

    const homeItem = { id: 'home' as PageId, name: 'Home', icon: <HomeIcon /> };
    const topItems = [
        { id: 'dashboard' as PageId, name: 'Dashboard', icon: <DashboardIcon /> },
        TRACKERS[0], // Habits
    ];
    const bottomItems = [
        TRACKERS[1], // Mood
        TRACKERS[2], // Journal
    ];


    return (
        <aside className="w-24 bg-light-secondary dark:bg-secondary border-r border-light-border-color dark:border-border-color flex flex-col items-center justify-between py-6">
            <div className="flex-1 flex flex-col justify-center items-center w-full">
                <div ref={navContainerRef} className="relative flex flex-col items-center">
                    {/* Wave Indicator */}
                    <div 
                        className="absolute  -translate-x-1/2 w-16 h-16 bg-accent rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{
                            transform: indicatorTop !== null ? `translateY(${indicatorTop}px)` : 'scale(0)',
                            opacity: indicatorTop !== null ? 1 : 0,
                        }}
                        aria-hidden="true"
                    />

                    {/* Top Icons */}
                    <div className="flex flex-col items-center space-y-5">
                        {topItems.map(item => (
                            // fix: Removed unnecessary 'as PageId' cast. With corrected Tracker type, item.id is compatible with PageId.
                            <NavButton key={item.id} item={item} isSelected={selectedPage === item.id} onClick={() => setSelectedPage(item.id)} />
                        ))}
                    </div>

                    {/* Home Icon */}
                    <div className="my-5">
                         <NavButton item={homeItem} isSelected={selectedPage === 'home'} onClick={() => setSelectedPage('home')} />
                    </div>

                    {/* Bottom Icons */}
                     <div className="flex flex-col items-center space-y-5">
                        {bottomItems.map(item => (
                            // fix: Removed unnecessary 'as PageId' cast. With corrected Tracker type, item.id is compatible with PageId.
                            <NavButton key={item.id} item={item} isSelected={selectedPage === item.id} onClick={() => setSelectedPage(item.id)} />
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={() => setIsSettingsOpen(true)}
                className="relative w-14 h-14 rounded-full flex items-center justify-center text-light-text-secondary dark:text-text-secondary hover:bg-light-border-color dark:hover:bg-border-color transition-colors duration-200 group"
                aria-label="Settings"
            >
                <div className="transition-transform duration-300 transform group-hover:scale-110">
                    <SettingsIcon />
                </div>
            </button>
        </aside>
    );
};

export default Sidebar;