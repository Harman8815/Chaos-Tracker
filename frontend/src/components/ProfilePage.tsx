import React, { useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './ui/Card';
import Button from './ui/Button';
import { AllData, DailyData } from '../types';

// --- Icons ---
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

// --- Components ---

const Heatmap: React.FC<{ data: AllData }> = ({ data }) => {
    const { weeks, monthLabels, totalActiveDays } = useMemo(() => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);
        
        // Adjust to start on Sunday
        const dayOfWeek = startDate.getDay(); 
        const adjustedStartDate = new Date(startDate);
        adjustedStartDate.setDate(startDate.getDate() - dayOfWeek);

        const weeks = [];
        const monthLabels: { index: number; label: string }[] = [];
        let totalActive = 0;

        let currentDate = new Date(adjustedStartDate);

        // We generate roughly 53 weeks to cover the year
        for (let w = 0; w < 53; w++) {
            const week = [];
            let hasFirstOfMonth = false;
            let monthName = "";

            for (let d = 0; d < 7; d++) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const dayData = data[dateStr];
                const score = dayData ? Object.values(dayData.habitScores || {}).reduce((a: number, b: number) => a + (Number(b) || 0), 0) : 0;
                
                if (score > 0) totalActive++;

                if (currentDate.getDate() === 1) {
                    hasFirstOfMonth = true;
                    monthName = currentDate.toLocaleString('default', { month: 'short' });
                }

                week.push({ date: dateStr, score });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            weeks.push(week);
            if (hasFirstOfMonth) {
                monthLabels.push({ index: w, label: monthName });
            }
        }

        return { weeks, monthLabels, totalActiveDays: totalActive };
    }, [data]);

    const getColor = (count: number) => {
        if (count === 0) return 'bg-[#1f1f1f]'; // Inactive - Dark Gray
        if (count <= 10) return 'bg-[#4c1d95]'; // Low - Dark Violet
        if (count <= 20) return 'bg-[#6d28d9]'; // Medium - Violet
        if (count <= 30) return 'bg-[#8b5cf6]'; // High - Light Violet
        return 'bg-[#c4b5fd]';                   // Max - Bright Violet
    };

    return (
        <Card className="w-full overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold">Submission Calendar</h3>
                 <div className="text-xs text-text-secondary">
                    Total Active Days: <span className="text-white font-bold">{totalActiveDays}</span>
                 </div>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar pb-2">
                <div className="min-w-[850px] px-2">
                    {/* Month Labels */}
                    <div className="flex relative h-6 mb-2 text-xs text-text-secondary select-none">
                        {monthLabels.map((m, i) => {
                            // Prevent overlapping labels (simple heuristic)
                            if (i > 0 && (m.index - monthLabels[i-1].index) < 3) return null;
                            return (
                                <span key={`${m.label}-${m.index}`} style={{ left: `${m.index * 15}px` }} className="absolute">
                                    {m.label}
                                </span>
                            );
                        })}
                    </div>

                    {/* Grid */}
                    <div className="flex gap-[3px]">
                         {/* Day Labels (Mon, Wed, Fri) */}
                        <div className="flex flex-col gap-[3px] text-[10px] text-text-secondary mr-2 select-none">
                             <div className="h-[12px]"></div>
                             <span className="h-[12px] flex items-center">Mon</span>
                             <div className="h-[12px]"></div>
                             <span className="h-[12px] flex items-center">Wed</span>
                             <div className="h-[12px]"></div>
                             <span className="h-[12px] flex items-center">Fri</span>
                             <div className="h-[12px]"></div>
                        </div>

                        {weeks.map((week, wIndex) => (
                            <div key={wIndex} className="flex flex-col gap-[3px]">
                                {week.map((day) => (
                                    <div 
                                        key={day.date}
                                        className={`w-[12px] h-[12px] rounded-[2px] ${getColor(day.score)} relative group`}
                                        title={`${day.date}: ${day.score} points`}
                                    >
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

             {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-text-secondary mr-4 select-none">
                <span>Less</span>
                <div className={`w-[12px] h-[12px] rounded-[2px] bg-[#1f1f1f]`}></div>
                <div className={`w-[12px] h-[12px] rounded-[2px] bg-[#4c1d95]`}></div>
                <div className={`w-[12px] h-[12px] rounded-[2px] bg-[#6d28d9]`}></div>
                <div className={`w-[12px] h-[12px] rounded-[2px] bg-[#8b5cf6]`}></div>
                <div className={`w-[12px] h-[12px] rounded-[2px] bg-[#c4b5fd]`}></div>
                <span>More</span>
            </div>
        </Card>
    );
};

const CircleStats: React.FC<{ data: AllData }> = ({ data }) => {
    const stats = useMemo(() => {
        let total = 0;
        let perfect = 0; // > 80% of max possible (approx 70 pts usually)
        let good = 0; // > 50%
        let fair = 0; // > 0

        Object.values(data).forEach((d: unknown) => {
            const daily = d as DailyData;
            const score = Object.values(daily.habitScores || {}).reduce((sum: number, s: number) => sum + (Number(s) || 0), 0);
            if (score > 0) total++;
            if (score > 60) perfect++; // Assuming max daily ~70-90
            else if (score > 30) good++;
            else if (score > 0) fair++;
        });

        return { total, perfect, good, fair };
    }, [data]);

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const totalCounts = stats.total || 1;
    
    // Calculate segments
    const perfectDash = (stats.perfect / totalCounts) * circumference;
    const goodDash = (stats.good / totalCounts) * circumference;
    const fairDash = (stats.fair / totalCounts) * circumference;

    return (
        <Card className="flex flex-col">
             <h3 className="text-lg font-bold mb-4">Habit Consistency</h3>
             <div className="flex items-center gap-8">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg width="160" height="160" className="transform -rotate-90">
                        <circle cx="80" cy="80" r={radius} fill="transparent" stroke="var(--color-input-bg)" strokeWidth="8" />
                        {/* Segments - simplified stacking for visual donut */}
                        <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray={`${perfectDash} ${circumference}`} strokeDashoffset="0" />
                        <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f59e0b" strokeWidth="8" strokeDasharray={`${goodDash} ${circumference}`} strokeDashoffset={-perfectDash} />
                        <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${fairDash} ${circumference}`} strokeDashoffset={-(perfectDash + goodDash)} />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">{stats.total}</span>
                        <span className="text-xs text-text-secondary">Days Tracked</span>
                    </div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                    <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Perfect</span>
                         </div>
                         <span className="font-bold">{stats.perfect}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Good</span>
                         </div>
                         <span className="font-bold">{stats.good}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Fair</span>
                         </div>
                         <span className="font-bold">{stats.fair}</span>
                    </div>
                </div>
             </div>
        </Card>
    )
}

const BadgesSection: React.FC<{ achievements: any[] }> = ({ achievements }) => {
    const recent = achievements.slice(0, 3);
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Recent Badges</h3>
                <span className="text-xs text-text-secondary">{achievements.length} Total</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {recent.length > 0 ? recent.map((ach, i) => (
                    <div key={ach.id} className="flex flex-col items-center text-center group">
                         <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 border border-accent-primary/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                             {ach.coverImage ? (
                                 <img src={ach.coverImage} alt={ach.title} className="w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-100"/>
                             ) : (
                                 <AwardIcon className="w-8 h-8 text-accent-primary" />
                             )}
                         </div>
                         <span className="text-xs font-medium line-clamp-2">{ach.title}</span>
                         <span className="text-[10px] text-text-secondary mt-1">{new Date(ach.date).getFullYear()}</span>
                    </div>
                )) : (
                    <div className="col-span-3 text-center text-sm text-text-secondary py-4">No badges earned yet.</div>
                )}
            </div>
        </Card>
    );
}

const ProfilePage: React.FC = () => {
    const { data, userProfile, achievements, setSelectedPage } = useContext(DataContext);

    const rank = useMemo(() => {
        // Simple rank calculation based on total days tracked
        const days = Object.keys(data).length;
        if (days > 100) return "Grandmaster";
        if (days > 50) return "Master";
        if (days > 20) return "Advanced";
        return "Novice";
    }, [data]);
    
    const skills = userProfile.skills || [];

    const handleEditClick = () => {
        setSelectedPage('edit-profile');
    };

    return (
        <div className="p-6 h-full overflow-y-auto animate-fade-in max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="relative overflow-hidden">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative w-32 h-32 mb-4 group cursor-pointer" onClick={handleEditClick}>
                                <img 
                                    src={userProfile.avatar || `https://ui-avatars.com/api/?name=${userProfile.name.replace(' ', '+')}&background=7c3aed&color=fff&size=128`} 
                                    alt={userProfile.name} 
                                    className="w-full h-full rounded-xl object-cover shadow-lg border-4 border-[rgba(15,10,30,0.75)]"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <EditIcon className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                            <p className="text-text-secondary text-sm mb-4">@{userProfile.name.toLowerCase().replace(/\s/g, '')}</p>
                            
                            <div className="w-full py-2 bg-white/[0.06]/50 rounded-lg mb-4 border border-accent-primary/35">
                                <span className="text-accent-primary font-bold uppercase tracking-widest text-xs">Rank: {rank}</span>
                            </div>

                            {userProfile.bio && <p className="text-sm text-text-secondary mb-6 px-2 italic">"{userProfile.bio}"</p>}

                            <Button className="w-full mb-4" onClick={handleEditClick}>Edit Profile</Button>

                            <div className="flex justify-center gap-4 w-full pt-4 border-t border-accent-primary/35">
                                {userProfile.location && (
                                    <div className="flex items-center text-xs text-text-secondary" title="Location">
                                        <MapPinIcon className="w-4 h-4 mr-1" /> {userProfile.location}
                                    </div>
                                )}
                                {userProfile.socials?.github && (
                                    <a href={userProfile.socials.github} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-white transition-colors">
                                        <GithubIcon />
                                    </a>
                                )}
                                {userProfile.socials?.linkedin && (
                                    <a href={userProfile.socials.linkedin} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-white transition-colors">
                                        <LinkedinIcon />
                                    </a>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-md mb-3">Community Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Views</span>
                                <span className="font-mono">1.2k</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Solution</span>
                                <span className="font-mono">{achievements.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Reputation</span>
                                <span className="font-mono">42</span>
                            </div>
                        </div>
                    </Card>
                    
                    <Card>
                         <h3 className="font-bold text-md mb-3">Skills</h3>
                         <div className="flex flex-wrap gap-2">
                             {skills.length > 0 ? skills.map(skill => (
                                 <span key={skill} className="px-2 py-1 rounded bg-white/[0.06] text-xs text-text-secondary border border-accent-primary/35 hover:border-accent-primary transition-colors cursor-default">{skill}</span>
                             )) : (
                                 <span className="text-xs text-text-secondary italic">No skills added yet.</span>
                             )}
                         </div>
                    </Card>
                </div>

                {/* Right Column: Main Stats & Heatmap */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CircleStats data={data} />
                        <BadgesSection achievements={achievements} />
                    </div>
                    
                    <Heatmap data={data} />

                    <Card>
                        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                        <div className="space-y-0">
                            {Object.entries(data)
                                .sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                                .slice(0, 5)
                                .map(([date, d]) => {
                                    const dayData = d as DailyData;
                                    const scores = Object.values(dayData.habitScores || {});
                                    return (
                                    <div key={date} className="flex items-start gap-4 py-3 border-b border-accent-primary/35/50 last:border-0">
                                        <div className="flex flex-col items-center min-w-[50px]">
                                            <span className="text-xs font-bold text-text-secondary uppercase">{new Date(date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                            <span className="text-xl font-bold">{new Date(date).getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm">
                                                Completed <span className="font-bold text-accent-primary">{scores.filter((s: number) => (Number(s)||0) > 0).length} habits</span> with a total score of <span className="font-mono">{scores.reduce((a: number,b: number) => a+(Number(b)||0),0)}</span>.
                                            </p>
                                            {dayData.journal && (
                                                <p className="text-xs text-text-secondary mt-1 italic line-clamp-1">"{dayData.journal}"</p>
                                            )}
                                        </div>
                                    </div>
                                )})}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

