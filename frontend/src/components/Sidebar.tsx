"use client";
import React, { useContext, useMemo, useRef, useState, useEffect } from 'react';
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

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { userProfile } = useContext(DataContext);
    const { setIsSettingsModalOpen } = useContext(SettingsContext);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

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

    useEffect(() => {
        const idx = navItems.findIndex(item => item.id === selectedPage);
        if (idx >= 0) updateIndicator(idx);
    }, [selectedPage, navItems]);

    if (isCollapsed) {
        return (
            <div className="fixed top-6 left-6 z-50 flex justify-between pr-12 w-full gap-4">
                <button
                    onClick={() => setIsCollapsed(false)}
                    aria-label="Open menu"
                    className="flex items-center justify-center
                            w-14 h-14 rounded-lg bg-sidebar-bg/80 backdrop-blur-xl border border-accent-primary/20
                            text-sidebar-icon hover:text-text-primary hover:border-accent-primary
                            transition-colors duration-200 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>
            </div>
        );
    }

    const initials = userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'GU';

    return (
        <aside className="relative bg-sidebar-bg/80 backdrop-blur-xl flex flex-col items-center transition-all duration-200 w-24 py-6 z-20 flex-shrink-0  shadow-[0_0_30px_rgba(99,102,241,0.1)]">
            <button
                onClick={() => setIsCollapsed(true)}
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
                                prefetch
                                className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 focus:outline-none z-10
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
                        prefetch
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
