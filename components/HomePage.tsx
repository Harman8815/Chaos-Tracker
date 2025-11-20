
import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

const HomePage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animate background decoration
            gsap.to('.decoration', {
                y: -20,
                rotation: 5,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 1,
                    from: "random"
                }
            });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(titleRef.current, 
                { y: 100, opacity: 0, skewY: 7 },
                { y: 0, opacity: 1, skewY: 0, duration: 1.2 }
            )
            .fromTo(subtitleRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                "-=0.8"
            )
            .fromTo('.decoration', 
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 0.2, duration: 1.5, stagger: 0.2 },
                "-=1"
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <div 
                className="absolute inset-0 z-0" 
                style={{ 
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, var(--color-background) 70%)' 
                }}
            />
            
            {/* Decorative Elements */}
            <div className="decoration absolute top-1/4 left-1/4 w-32 h-32 bg-accent-primary rounded-full blur-3xl opacity-0" />
            <div className="decoration absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-0" />
            <div className="decoration absolute top-1/2 left-2/3 w-24 h-24 bg-purple-500 rounded-full blur-2xl opacity-0" />
            <div className="decoration absolute top-[10%] right-[10%] w-40 h-40 bg-indigo-600 rounded-full blur-[60px] opacity-0" />

            <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-4">
                <h1
                    ref={titleRef}
                    className="home-font text-6xl md:text-8xl font-bold mb-4 opacity-0 transform-gpu"
                    style={{ textShadow: '0 0 15px rgba(124, 58, 237, 0.7), 0 0 30px rgba(124, 58, 237, 0.5)' }}
                >
                    Welcome
                </h1>
                <p
                    ref={subtitleRef}
                    className="home-font text-xl md:text-2xl text-text-secondary max-w-md opacity-0"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                >
                    Your daily companion for tracking habits, measuring progress, and building a better you.
                </p>
            </div>
             <style>{`
                .home-font {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </div>
    );
};

export default HomePage;
