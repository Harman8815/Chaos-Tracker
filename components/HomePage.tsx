import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            {/* Added a subtle radial gradient background to replace the starfield */}
            <div 
                className="absolute inset-0 z-0" 
                style={{ 
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, var(--color-background) 70%)' 
                }}
            />
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-4 animate-fade-in">
                <h1
                    className="home-font text-6xl md:text-8xl font-bold mb-4"
                    style={{ textShadow: '0 0 15px rgba(124, 58, 237, 0.7), 0 0 30px rgba(124, 58, 237, 0.5)' }}
                >
                    Welcome
                </h1>
                <p
                    className="home-font text-xl md:text-2xl text-text-secondary max-w-md"
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