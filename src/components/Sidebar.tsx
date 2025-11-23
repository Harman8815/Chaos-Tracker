import React, { useContext, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DataContext } from '../context/DataContext';
import { SettingsContext } from '../context/SettingsContext';
import { TRACKERS } from '../constants';
import { PageId, Tracker } from '../types';

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
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

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
    const pathname = usePathname();
    const { userProfile } = useContext(DataContext);
    const { setIsSettingsModalOpen, t } = useContext(SettingsContext);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const navItems = useMemo(() => {
        const allPossibleItems: (Omit<Tracker, 'name'> & { name: string } | { id: PageId; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; })[] = [
            { id: 'dashboard', name: t('dashboard'), icon: DashboardIcon },
            ...TRACKERS.map(tracker => ({ ...tracker, name: t(tracker.id) })),
            { id: 'home', name: t('home'), icon: HomeIcon },
        ];

        const orderedIds: PageId[] = [
            'dashboard',
            'planner',
            'goals',
            'expense',

            'home', // CENTER

            'points',
            'journal',
            'achievements',
            'quotes'
        ];


        return orderedIds.map(id => {
            const item = allPossibleItems.find(i => i.id === id);
            return item ? { ...item, type: 'item' as const } : null;
        }).filter(Boolean) as ({ id: PageId; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; type: 'item' })[];
    }, [t]);

    const getActiveId = (path: string): PageId => {
        if (path === '/') return 'home';
        const id = path.substring(1);
        return id as PageId;
    };

    const selectedPage = getActiveId(pathname);

    if (isCollapsed) {
        return (
            <div className="fixed top-6 left-6 z-50 flex justify-between pr-12 w-full gap-4 animate-fade-in ">
                <button
                    onClick={toggleSidebar}
                    aria-label="Open menu"
                    className="flex items-center justify-center
                            w-14 h-14 rounded-full bg-sidebar-bg shadow-lg border border-border
                            text-text-secondary hover:text-text-primary hover:border-accent-primary
                            transition-all duration-300 ease-in-out group"
                >
                    <MenuIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                </button>
                <div className="relative bg-gradient-to-br from-sidebar-bg/80 to-sidebar-bg/60 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg hover:scale-110 transition-all duration-300 group">
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-accent-primary via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider relative">
                        Tracker
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>
            </div>
        );
    }

    const initials = userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'GU';

    return (
        <aside className="relative bg-sidebar-bg flex flex-col items-center shadow-2xl transition-all duration-300 ease-in-out w-24 py-6 animate-fade-in z-20 flex-shrink-0">
            <button
                onClick={toggleSidebar}
                className="flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ease-in-out text-text-secondary hover:text-text-primary focus:outline-none group mb-4 hover:bg-input-bg"
                aria-label="Close menu"
            >
                <MenuIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
            </button>

            <div className="flex flex-col items-center justify-between h-full w-full">
                <div className="relative flex flex-col items-center justify-center space-y-3 flex-grow w-full">
                    {navItems.map((item, index) => {
                        const isSelected = selectedPage === item.id;
                        const href = item.id === 'home' ? '/' : `/${item.id}`;
                        return (
                            <Link
                                key={item.id}
                                href={href}
                                ref={el => { itemRefs.current[index] = el; }}
                                prefetch={false}
                                className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-in-out focus:outline-none z-10
                                ${isSelected ? 'text-white ring-2 ring-blue-400' : 'text-text-secondary hover:text-text-primary hover:bg-input-bg'}
                            `}
                                title={item.name}
                            >
                                <item.icon className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ease-in-out
                                ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                                />
                            </Link>
                        )
                    })}
                </div>

                <div className="flex flex-col items-center space-y-3">
                    {/* Profile Avatar Button */}
                    <Link
                        href="/profile"
                        prefetch={false}
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out focus:outline-none group overflow-hidden
                             ${selectedPage === 'profile' ? 'ring-2 ring-accent-primary' : 'hover:ring-2 hover:ring-border'}
                        `}
                        title="Profile"
                    >
                        {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-accent-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {initials}
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ease-in-out text-text-secondary hover:text-text-primary focus:outline-none group hover:bg-input-bg"
                        aria-label={t('settings')}
                    >
                        <SettingsIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
