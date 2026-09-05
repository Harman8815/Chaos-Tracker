import React, { useContext, useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    motion,
    useSpring,
    useTransform,
    useMotionValueEvent,
    MotionValue,
} from 'framer-motion';
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

// Row height (matches the h-12 nav item) and the size of the circular
// "droplet" badge that sits on the active icon once the wave settles.
const ITEM_HEIGHT = 48;
const BADGE_SIZE = 44;
// Home is the "hero" stop on the rail — its settled badge and its collapsed
// button are both larger than a normal row, so it visibly breaks the grid.
const HOME_BADGE_SIZE = 60;
// How far (in px of travel) the wave has to close in on its target before
// it's considered "settled" and the badge/ray fade in.
const SETTLE_DISTANCE = 36;

// ---------------------------------------------------------------------------
// A single nav icon that reacts as the traveling wave passes near it.
// ---------------------------------------------------------------------------
interface WaveIconProps {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isSelected: boolean;
    isHovered: boolean;
    isHome: boolean;
    headY: MotionValue<number>;
    centerY: number;
    reducedMotion: boolean;
}

const WaveIcon: React.FC<WaveIconProps> = ({ Icon, isSelected, isHovered, isHome, headY, centerY, reducedMotion }) => {
    // As the wave's leading edge (headY) sweeps past this icon's vertical
    // center, briefly bump its scale/brightness — this is the "nearby icons
    // react as the wave passes" behavior from the spec.
    const proximityScale = useTransform(headY, [centerY - 60, centerY, centerY + 60], [1, 1.14, 1]);
    const proximityGlow = useTransform(headY, [centerY - 60, centerY, centerY + 60], [0, 1, 0]);

    return (
        <div className="relative z-10 flex items-center justify-center flex-shrink-0">
            <motion.div style={reducedMotion || isSelected ? undefined : { scale: proximityScale }}>
                <Icon
                    className={`transition-colors duration-200 ${isHome ? 'w-7 h-7' : 'w-6 h-6'}
                        ${isSelected ? 'text-yellow-400' : ''}
                        ${isHovered && !isSelected ? 'text-white' : ''}
                    `}
                />
            </motion.div>
            {isSelected && (
                <span className="absolute inset-0 rounded-full bg-yellow-400/25 blur-md -z-10" />
            )}
            {!isSelected && !reducedMotion && (
                <motion.span
                    className="absolute inset-0 rounded-full bg-accent-primary/30 blur-md -z-10 pointer-events-none"
                    style={{ opacity: proximityGlow }}
                />
            )}
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, onNavigate }) => {
    const pathname = usePathname();
    const { userProfile } = useContext(DataContext);
    const { setIsSettingsModalOpen } = useContext(SettingsContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
    const [centers, setCenters] = useState<number[]>([]);
    const [arrivalPulse, setArrivalPulse] = useState(false);
    const wasSettledRef = useRef(true);

    const reducedMotion = prefersReducedMotion();

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
    const activeIndex = navItems.findIndex(item => item.id === selectedPage);

    // ------------------------------------------------------------------
    // The wave itself: two springs tracking the same target, but tuned
    // with different stiffness/damping/mass. Because they settle at
    // different rates, the gap between them (`diff`) naturally opens up
    // mid-travel and closes back to zero on arrival — that gap is what
    // draws the elongated, fluid "droplet" shape, with zero extra logic
    // needed to fake acceleration/deceleration or distance-awareness:
    // a longer trip just means a longer-lived gap.
    // ------------------------------------------------------------------
    const headY = useSpring(0, { stiffness: 300, damping: 28, mass: 0.9 });
    const tailY = useSpring(0, { stiffness: 110, damping: 22, mass: 1.6 });
    // Trails even further behind tailY — low opacity, heavily blurred, wide.
    // This is what gives the travel a "smoky liquid" depth instead of a
    // single hard-edged capsule sliding around.
    const trailY = useSpring(0, { stiffness: 55, damping: 16, mass: 2.4 });

    const diff = useTransform([headY, tailY], (latest: number[]) => Math.abs(latest[0] - latest[1]));
    const blobTop = useTransform([headY, tailY], (latest: number[]) => Math.min(latest[0], latest[1]) - ITEM_HEIGHT / 2);
    const blobHeight = useTransform(diff, (d: number) => d + ITEM_HEIGHT);
    const blobSquash = useTransform(diff, [0, 160], [1, 0.86]);
    const settleProgress = useTransform(diff, [0, SETTLE_DISTANCE], [1, 0]);
    const badgeCenter = useTransform([headY, tailY], (latest: number[]) => (latest[0] + latest[1]) / 2);

    const trailDiff = useTransform([headY, trailY], (latest: number[]) => Math.abs(latest[0] - latest[1]));
    const trailTop = useTransform([headY, trailY], (latest: number[]) => Math.min(latest[0], latest[1]) - ITEM_HEIGHT / 2);
    const trailHeight = useTransform(trailDiff, (d: number) => d + ITEM_HEIGHT * 1.4);

    useMotionValueEvent(diff, 'change', (latest) => {
        const settled = latest <= 2;
        if (settled && !wasSettledRef.current) {
            setArrivalPulse(true);
            window.setTimeout(() => setArrivalPulse(false), 450);
        }
        wasSettledRef.current = settled;
    });

    const measureCenters = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const parentRect = container.getBoundingClientRect();
        const next = itemRefs.current.map(el => {
            if (!el) return 0;
            const rect = el.getBoundingClientRect();
            return rect.top - parentRect.top + rect.height / 2;
        });
        setCenters(next);
    }, []);

    useLayoutEffect(() => {
        measureCenters();
        window.addEventListener('resize', measureCenters);
        return () => window.removeEventListener('resize', measureCenters);
    }, [measureCenters, navItems.length]);

    useLayoutEffect(() => {
        if (activeIndex < 0 || centers.length === 0) return;
        const target = centers[activeIndex] ?? 0;
        headY.set(target);
        tailY.set(target);
        trailY.set(target);
    }, [activeIndex, centers, headY, tailY, trailY]);

    const initials = userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'GU';

    const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
    const showWave = activeIndex >= 0 && centers.length > 0;
    const activeIsHome = activeIndex >= 0 && navItems[activeIndex]?.id === 'home';
    const badgeSize = activeIsHome ? HOME_BADGE_SIZE : BADGE_SIZE;
    const badgeLeftStyle: React.CSSProperties = isCollapsed
        ? { left: '50%', transform: 'translate(-50%, -50%)' }
        : { left: '24px', transform: 'translate(-50%, -50%)' };

    return (
        <aside className={`${sidebarWidth} h-screen flex flex-col transition-all duration-300 bg-white/[0.04] backdrop-blur-xl border-r border-white/10 shadow-[0_0_25px_rgba(124,58,237,0.25)] flex-shrink-0 relative z-50`}>
            <div className="flex items-center w-full px-4 py-4">
                <button
                    onClick={toggleSidebar}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 text-text-secondary hover:text-white focus:outline-none hover:bg-white/[0.08]"
                    aria-label={isCollapsed ? "Open menu" : "Close menu"}
                >
                    <MenuIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col h-full w-full px-2 pb-4">
                <div ref={containerRef} className="relative flex flex-col justify-center space-y-1 flex-grow w-full">

                    {/* Smoky trail: wider, softer, and further behind than the main
                        wave — adds depth so the travel reads as liquid rather than
                        a single shape sliding up and down. */}
                    {showWave && !reducedMotion && (
                        <motion.div
                            aria-hidden
                            className="absolute -inset-x-2 rounded-[999px] pointer-events-none z-0"
                            style={{
                                top: trailTop,
                                height: trailHeight,
                                background: 'radial-gradient(closest-side, rgba(139,92,246,0.25), transparent 75%)',
                                filter: 'blur(6px)',
                            }}
                        />
                    )}

                    {/* Traveling liquid wave: a single element whose top/height are
                        driven by the two springs above. Mid-travel the gap between
                        the springs stretches it into an elongated capsule; at rest
                        it collapses back down to a single row's height. */}
                    {showWave && !reducedMotion && (
                        <motion.div
                            aria-hidden
                            className="absolute inset-x-0 rounded-[999px] pointer-events-none z-0"
                            style={{
                                top: blobTop,
                                height: blobHeight,
                                scaleX: blobSquash,
                                background: 'linear-gradient(180deg, rgba(139,92,246,0.4), rgba(76,29,149,0.5))',
                                filter: 'blur(1px)',
                                boxShadow: '0 0 26px 6px rgba(99,102,241,0.4)',
                            }}
                        />
                    )}

                    {/* Reduced-motion fallback: a plain static highlight, no travel. */}
                    {showWave && reducedMotion && (
                        <div
                            aria-hidden
                            className="absolute inset-x-0 rounded-xl bg-accent-primary shadow-[0_0_18px_rgba(99,102,241,0.45)] pointer-events-none z-0"
                            style={{ top: (centers[activeIndex] ?? 0) - ITEM_HEIGHT / 2, height: ITEM_HEIGHT }}
                        />
                    )}

                    {/* The settled droplet: a circular glow badge plus a thin light
                        ray through the row, both faded in only once the wave has
                        essentially arrived (settleProgress -> 1) so the transition
                        reads as "arrive, then bloom" rather than a constant glow
                        being dragged around. */}
                    {showWave && !reducedMotion && (
                        <>
                            {/* Slow ambient breathing glow so the settled state still
                                feels alive, not just during transitions. */}
                            <motion.div
                                aria-hidden
                                className="absolute rounded-full pointer-events-none z-0 animate-pulse"
                                style={{
                                    top: badgeCenter,
                                    width: badgeSize + 24,
                                    height: badgeSize + 24,
                                    opacity: settleProgress,
                                    background: 'radial-gradient(closest-side, rgba(250,204,21,0.18), transparent 70%)',
                                    animationDuration: '3.5s',
                                    ...badgeLeftStyle,
                                }}
                            />
                            <motion.div
                                aria-hidden
                                className={`absolute rounded-full pointer-events-none z-0 transition-[box-shadow,width,height] duration-300 ${arrivalPulse ? 'shadow-[0_0_40px_12px_rgba(250,204,21,0.55)]' : 'shadow-[0_0_18px_rgba(99,102,241,0.45)]'}`}
                                style={{
                                    top: badgeCenter,
                                    width: badgeSize,
                                    height: badgeSize,
                                    opacity: settleProgress,
                                    background: 'rgba(var(--color-accent-primary-rgb), 0.4)',
                                    ...badgeLeftStyle,
                                }}
                            />
                            <motion.div
                                aria-hidden
                                className="absolute inset-x-0 pointer-events-none z-0 h-px"
                                style={{
                                    top: badgeCenter,
                                    opacity: settleProgress,
                                    background: 'linear-gradient(90deg, transparent, rgba(250,204,21,0.5) 30%, rgba(250,204,21,0.5) 70%, transparent)',
                                }}
                            />
                        </>
                    )}

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
                                className={`relative flex items-center transition-colors duration-200 focus:outline-none z-10 group
                                ${isSelected ? 'text-text-inverse' : 'text-text-secondary hover:text-white hover:bg-white/[0.08]'}
                                ${isCollapsed
                                    ? (isSelected ? 'w-14 h-14 mx-auto justify-center rounded-full my-5' : 'w-12 h-12 mx-auto justify-center rounded-xl')
                                    : `w-full h-12 px-3 rounded-xl ${isSelected ? 'my-4' : ''}`
                                }
                            `}
                                title={isCollapsed ? item.name : undefined}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(-1)}
                            >
                                {item.icon && (
                                    <WaveIcon
                                        Icon={item.icon}
                                        isSelected={isSelected}
                                        isHovered={hoveredIndex === index}
                                        isHome={isHome}
                                        headY={headY}
                                        centerY={centers[index] ?? 0}
                                        reducedMotion={reducedMotion}
                                    />
                                )}
                                {!isCollapsed && (
                                    <span className={`ml-3 font-medium transition-all duration-200 truncate w-full
                                        ${isSelected ? 'text-white' : 'text-text-secondary group-hover:text-white'}
                                    `}>
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </div>

                <div className="flex flex-col space-y-3 mt-auto">
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
                            <div className="w-full h-full bg-accent-primary flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(139,92,246,0.55)]">
                                {initials}
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 text-text-secondary hover:text-white focus:outline-none hover:bg-white/[0.08]"
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
