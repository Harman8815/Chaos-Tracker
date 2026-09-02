import React, { useContext, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DataContext } from '../context/DataContext';
import { SettingsContext } from '../context/SettingsContext';
import { TRACKERS } from '../constants';
import { PageId, Tracker } from '../types';

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
);
const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2 2 2 2 0 0 1 2 2h.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
    const pathname = usePathname();
    const { userProfile } = useContext(DataContext);
    const { setIsSettingsModalOpen } = useContext(SettingsContext);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

    const allPossibleItems = [
        { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
        { id: 'habits', name: 'Habits', icon: null },
        { id: 'goals', name: 'Goals', icon: null },
        { id: 'planner', name: 'Planner', icon: null },
        { id: 'expense', name: 'Expenses', icon: null },
        { id: 'journal', name: 'Journal', icon: null },
        { id: 'mood', name: 'Mood', icon: null },
        { id: 'water', name: 'Water', icon: null },
        { id: 'pedometer', name: 'Pedometer', icon: null },
        { id: 'points', name: 'Points', icon: null },
        { id: 'achievements', name: 'Achievements', icon: null },
        { id: 'quotes', name: 'Quotes', icon: null },
        { id: 'home', name: 'Home', icon: HomeIcon },
    ];

    const navItems = useMemo(() => {
        const orderedIds: PageId[] = [
            'dashboard',
            'goals',
            'planner',
            'expense',
            'journal',
            'points',
            'achievements',
            'quotes',
            'home',
        ];

        return orderedIds.map(id => {
            const item = allPossibleItems.find(i => i.id === id);
            return item ? { ...item, type: 'item' as const } : null;
        }).filter(Boolean) as ({ id: PageId; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>> | null; type: 'item' })[];
    }, []);

    const getActiveId = (path: string): PageId => {
        if (path === '/') return 'home';
        const id = path.substring(1);
        return id as PageId;
    };

    const selectedPage = getActiveId(pathname);

    const updateIndicator = (index: number) => {
        if (prefersReducedMotion()) return;
        const el = itemRefs.current[index];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const parentRect = el.parentElement?.getBoundingClientRect();
        if (!parentRect) return;
        setIndicatorStyle({
            position: 'absolute',
            left: rect.left - parentRect.left,
            top: rect.top - parentRect.top,
            width: rect.width,
            height: rect.height,
        });
        setActiveIndex(index);
    };

    React.useEffect(() => {
        const idx = navItems.findIndex(item => item.id === selectedPage);
        if (idx >= 0) updateIndicator(idx);
    }, [selectedPage, navItems]);

    if (isCollapsed) {
        return (
            <div className="fixed top-6 left-6 z-50 flex justify-between pr-12 w-full gap-4">
                <button
                    onClick={toggleSidebar}
                    aria-label="Open menu"
                    className="flex items-center justify-center
                            w-14 h-14 rounded-lg bg-sidebar-bg border border-border
                            text-sidebar-icon hover:text-text-primary hover:border-accent-primary
                            transition-colors duration-200"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>
                <div className="bg-sidebar-bg px-6 py-3 rounded-lg border border-border">
                    <span className="text-2xl font-bold text-text-primary">
                        Tracker
                    </span>
                </div>
            </div>
        );
    }

    const initials = userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'GU';

    return (
        <aside className="relative bg-sidebar-bg flex flex-col items-center transition-all duration-200 w-24 py-6 z-20 flex-shrink-0 border-r border-border">
            <button
                onClick={toggleSidebar}
                className="flex items-center justify-center w-14 h-14 rounded-lg transition-colors duration-200 text-sidebar-icon hover:text-text-primary focus:outline-none mb-4 hover:bg-input-bg"
                aria-label="Close menu"
            >
                <MenuIcon className="w-6 h-6" />
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
                                className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 focus:outline-none z-10
                                ${isSelected ? 'text-text-inverse' : 'text-sidebar-icon hover:text-text-primary hover:bg-input-bg'}
                            `}
                                title={item.name}
                                onMouseEnter={() => updateIndicator(index)}
                            >
                                {isSelected && !prefersReducedMotion() && (
                                    <motion.div
                                        layoutId="sidebar-active-indicator"
                                        className="absolute inset-0 rounded-lg bg-accent-primary"
                                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 rounded-lg bg-accent-primary/40"
                                            animate={{ scale: [1, 1.25, 1] }}
                                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                                        />
                                    </motion.div>
                                )}
                                {isSelected && prefersReducedMotion() && (
                                    <div className="absolute inset-0 rounded-lg bg-accent-primary" />
                                )}
                                {item.icon && <item.icon className={`w-6 h-6 flex-shrink-0 relative z-10
                                ${isSelected ? '' : ''}`}
                                />}
                            </Link>
                        )
                    })}
                </div>

                <div className="flex flex-col items-center space-y-3">
                    {/* Profile Avatar Button */}
                    <Link
                        href="/profile"
                        prefetch={false}
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 focus:outline-none overflow-hidden
                             ${selectedPage === 'profile' ? 'ring-2 ring-accent-primary' : 'hover:ring-2 hover:ring-border'}
                        `}
                        title="Profile"
                    >
                        {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-accent-primary flex items-center justify-center text-text-inverse font-bold text-sm">
                                {initials}
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="relative flex items-center justify-center w-14 h-14 rounded-lg transition-colors duration-200 text-sidebar-icon hover:text-text-primary focus:outline-none hover:bg-input-bg"
                        aria-label="Settings"
                    >
                        <SettingsIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
