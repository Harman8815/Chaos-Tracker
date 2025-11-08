import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div className="w-full h-full flex items-center justify-center p-8">
            <div className="relative w-full h-full max-w-4xl max-h-4xl rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                     <h1 className="text-5xl font-bold mb-4 text-shadow">
                        Welcome
                    </h1>
                    <p className="text-xl text-shadow">
                        Your daily tracking companion.
                    </p>
                </div>
            </div>
             <style>{`
                .text-shadow {
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                @keyframes gradient-xy {
                    0%, 100% {
                        background-size: 400% 400%;
                        background-position: 15% 0%;
                    }
                    50% {
                        background-size: 400% 400%;
                        background-position: 85% 100%;
                    }
                }
                .animate-gradient-xy {
                    animation: gradient-xy 15s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default HomePage;
