import React, { useContext, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, Settings, Menu, Activity, Target, Calendar, Wallet, BookOpen, Smile, Droplets, Footprints, Star, Trophy, Quote } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { SettingsContext } from '../context/SettingsContext';
import { TRACKERS } from '../constants';
import { PageId, Tracker } from '../types';

const HomeIcon = Home;
const DashboardIcon = LayoutDashboard;
const SettingsIcon = Settings;
const MenuIcon = Menu;

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    onNavigate?: () => void;
}

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, onNavigate }) => {
    const pathname = usePathname();
    const { userProfile } = useContext(DataContext);
    const { setIsSettingsModalOpen } = useContext(SettingsContext);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

    const allPossibleItems = [
        { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
        { id: 'habits', name: 'Habits', icon: Activity },
        { id: 'goals', name: 'Goals', icon: Target },
        { id: 'planner', name: 'Planner', icon: Calendar },
        { id: 'expense', name: 'Expenses', icon: Wallet },
        { id: 'journal', name: 'Journal', icon: BookOpen },
        { id: 'mood', name: 'Mood', icon: Smile },
        { id: 'water', name: 'Water', icon: Droplets },
        { id: 'pedometer', name: 'Pedometer', icon: Footprints },
        { id: 'points', name: 'Points', icon: Star },
        { id: 'achievements', name: 'Achievements', icon: Trophy },
        { id: 'quotes', name: 'Quotes', icon: Quote },
        { id: 'home', name: 'Home', icon: HomeIcon },
    ];

    const navItems = useMemo(() => {
        const orderedIds: PageId[] = [
            'dashboard',
            'goals',
            'planner',
            'expense',
            'home',
            'journal',
            'points',
            'achievements',
            'quotes',
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

    const initials = userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'GU';

    const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

    return (
        <aside className={`${sidebarWidth} h-screen flex flex-col transition-all duration-300 bg-white/[0.04] backdrop-blur-xl border-r border-white/10 shadow-[0_0_25px_rgba(124,58,237,0.25)] flex-shrink-0 relative z-50`}>
            <div className="flex items-center w-full px-4 py-4">
                <button
                    onClick={toggleSidebar}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 text-[#a1a1aa] hover:text-white focus:outline-none hover:bg-white/[0.08]"
                    aria-label={isCollapsed ? "Open menu" : "Close menu"}
                >
                    <MenuIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col h-full w-full px-2 pb-4">
                <div className="flex flex-col items-start space-y-1 flex-grow w-full">
                    {navItems.map((item, index) => {
                        const isSelected = selectedPage === item.id;
                        const href = item.id === 'home' ? '/' : `/${item.id}`;
                        const isHome = item.id === 'home';
                        return (
                            <Link
                                key={item.id}
                                href={href}
                                ref={el => { itemRefs.current[index] = el; }}
                                prefetch
                                onClick={onNavigate}
                                className={`relative flex items-center w-full rounded-xl transition-all duration-200 focus:outline-none z-10 group
                                ${isSelected ? 'text-text-inverse' : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.08]'}
                                ${isCollapsed ? 'h-12 justify-center' : 'h-12 px-3'}
                                ${isHome ? 'mt-2 mb-2' : ''}
                            `}
                                title={isCollapsed ? item.name : undefined}
                                onMouseEnter={() => { updateIndicator(index); setHoveredIndex(index); }}
                                onMouseLeave={() => setHoveredIndex(-1)}
                            >
                                {isSelected && !prefersReducedMotion() && (
                                    <motion.div
                                        layoutId="sidebar-active-indicator"
                                        className="absolute inset-0 rounded-xl bg-[#4c1d95] shadow-[0_0_18px_rgba(99,102,241,0.45)]"
                                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 rounded-xl bg-accent-primary/40"
                                            animate={{ scale: [1, 1.25, 1] }}
                                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                                        />
                                    </motion.div>
                                )}
                                {isSelected && prefersReducedMotion() && (
                                    <div className="absolute inset-0 rounded-xl bg-[#4c1d95] shadow-[0_0_18px_rgba(99,102,241,0.45)]" />
                                )}
                                {!isSelected && hoveredIndex === index && !prefersReducedMotion() && (
                                    <motion.div
                                        className="absolute inset-0 rounded-xl bg-white/[0.08]"
                                        layoutId="sidebar-hover-indicator"
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    />
                                )}
                                {item.icon && (
                                    <div className="relative z-10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className={`w-6 h-6 transition-all duration-200
                                            ${isSelected ? 'text-yellow-400 animate-neon-pulse' : ''}
                                            ${hoveredIndex === index && !isSelected ? 'text-white scale-110 animate-neon-flicker' : ''}
                                        `}
                                        />
                                        {isSelected && (
                                            <span className="absolute inset-0 rounded-full bg-yellow-400/20 blur-md -z-10 animate-pulse" />
                                        )}
                                    </div>
                                )}
                                {!isCollapsed && (
                                    <span className={`ml-3 font-medium transition-all duration-200 truncate w-full
                                        ${isSelected ? 'text-white' : 'text-[#e9d5ff] group-hover:text-white'}
                                    `}>
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </div>

                <div className="flex flex-col items-center space-y-3 mt-auto">
                    {/* Profile Avatar Button */}
                    <Link
                        href="/profile"
                        prefetch
                        onClick={onNavigate}
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 focus:outline-none overflow-hidden
                             ${selectedPage === 'profile' ? 'ring-2 ring-accent-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'hover:ring-2 hover:ring-border'}
                        `}
                        title="Profile"
                    >
                        {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#8b5cf6] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(139,92,246,0.55)]">
                                {initials}
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 text-[#a1a1aa] hover:text-white focus:outline-none hover:bg-white/[0.08]"
                        aria-label="Settings"
                    >
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
