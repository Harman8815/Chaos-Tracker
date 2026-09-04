import React, { useRef, useLayoutEffect } from 'react';
import { Achievement } from '../../../types';
import Card from '../../ui/Card';
import { gsap } from 'gsap';

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

interface GridViewProps {
    achievements: Achievement[];
    onImageClick: (gallery: { images: string[], title: string }) => void;
    onEdit: (achievement: Achievement) => void;
}

const GridView: React.FC<GridViewProps> = ({ achievements, onImageClick, onEdit }) => {
    const gridRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".grid-item", 
                { opacity: 0, y: 50, scale: 0.95 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 0.5, 
                    stagger: 0.1,
                    ease: "power3.out"
                }
            );
        }, gridRef);
        return () => ctx.revert();
    }, [achievements]);

    return (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {achievements.map(achievement => (
                <Card 
                    key={achievement.id}
                    className="grid-item group p-0 flex flex-col overflow-hidden opacity-0 relative"
                >
                    <button 
                        onClick={() => onEdit(achievement)}
                        className="absolute top-2 right-2 z-10 p-2 bg-[rgba(15,10,30,0.75)]/70 backdrop-blur-sm rounded-full text-white hover:bg-accent-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Edit Achievement"
                    >
                        <EditIcon />
                    </button>
                    <img 
                        src={achievement.coverImage || achievement.images[0]}
                        alt={achievement.title}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => onImageClick({ images: achievement.images, title: achievement.title })}
                    />
                    <div className="p-4 flex flex-col flex-grow">
                        <span className="text-sm text-[#e9d5ff]">{new Date(achievement.date + 'T00:00:00').toLocaleDateString()}</span>
                        <h3 className="text-xl font-bold mt-1">{achievement.title}</h3>
                        <p className="text-sm text-[#e9d5ff] mt-2 flex-grow">{achievement.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {achievement.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 text-xs bg-[rgba(15,10,30,0.6)] rounded-full capitalize">{tag}</span>
                            ))}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default GridView;