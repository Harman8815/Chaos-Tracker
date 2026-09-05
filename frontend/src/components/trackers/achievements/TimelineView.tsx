import React, { useRef, useEffect } from 'react';
import { Achievement } from '../../../types';
import { gsap } from 'gsap';

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

interface TimelineViewProps {
    achievements: Achievement[];
    onImageClick: (gallery: { images: string[], title: string }) => void;
    onEdit: (achievement: Achievement) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ achievements, onImageClick, onEdit }) => {
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    const isLeft = el.classList.contains('timeline-item-left');
                    gsap.fromTo(el, 
                        { opacity: 0, x: isLeft ? -100 : 100 },
                        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
                    );
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.2 });

        const items = timelineRef.current?.querySelectorAll('.timeline-item');
        if (items) {
            items.forEach(item => observer.observe(item));
        }

        return () => observer.disconnect();
    }, [achievements]);

    return (
        <div ref={timelineRef} className="relative p-10">
            {/* Central Line */}
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-border -translate-x-1/2"></div>

            {achievements.map((achievement, index) => {
                const isLeft = index % 2 === 0;
                return (
                    <div 
                        key={achievement.id} 
                        className={`timeline-item group relative mb-12 flex items-center w-1/2 ${isLeft ? 'timeline-item-left left-0' : 'timeline-item-right left-1/2'}`}
                        style={{ opacity: 0 }} // Initially hidden for GSAP
                    >
                        {/* Dot on timeline */}
                        <div className={`absolute top-1/2 w-4 h-4 bg-accent-primary rounded-full border-4 border-background -translate-y-1/2 ${isLeft ? 'right-0 -mr-[9px]' : 'left-0 -ml-[9px]'}`}></div>
                        
                        <div className={`bg-[rgba(15,10,30,0.75)] p-4 rounded-lg shadow-lg border border-accent-primary/35 w-[calc(100%-2rem)] relative ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
                             <button 
                                onClick={() => onEdit(achievement)}
                                className="absolute top-2 right-2 p-1.5 bg-white/[0.06] rounded-full text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Edit Achievement"
                            >
                                <EditIcon />
                            </button>
                             <div className="flex flex-wrap gap-2 mb-2">
                                {achievement.images.map((img, i) => (
                                    <img 
                                        key={i}
                                        src={img}
                                        alt={`${achievement.title} - ${i+1}`}
                                        className="w-16 h-16 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => onImageClick({ images: achievement.images, title: achievement.title })}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-accent-primary">{new Date(achievement.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <h3 className="text-xl font-bold mt-1">{achievement.title}</h3>
                            <p className="text-sm text-text-secondary mt-2">{achievement.description}</p>
                             <div className="flex flex-wrap gap-2 mt-3">
                                {achievement.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 text-xs bg-white/[0.06] rounded-full capitalize">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TimelineView;
