import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const vantaRef = useRef<any>(null);

    useEffect(() => {
        if (!vantaRef.current && containerRef.current) {
            vantaRef.current = CLOUDS({
                el: containerRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,

                // ⭐ FIXED COLORS (all numeric hex)
                skyColor: 0x0A0F1F,
                cloudColor: 0x4C5B70,
                cloudShadowColor: 0x1B2330,
                sunColor: 0x6F7FA6,
                sunGlareColor: 0xAAB8FF,
                sunlightColor: 0x8FA3FF,

                THREE: THREE
            });
        }

        // return () => {
        //     if (vantaRef.current) {
        //         vantaRef.current.destroy();
        //         vantaRef.current = null;
        //     }
        // };
    }, []);

    return (
        <>
            {/* Background Layer - Fixed to cover entire viewport behind sidebar */}
            <div
                ref={containerRef}
                className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
                style={{ position: 'fixed', top: 0, left: 0 }}
            />

            {/* Content Layer - Centered relative to the layout container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center text-white pointer-events-none">
                <div className="text-center p-4 pointer-events-auto select-none">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-extrabold 
        bg-gradient-to-r from-cyan-400 to-purple-500 
        bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                    >
                        Welcome
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="text-xl md:text-2xl max-w-md mx-auto mt-5 text-gray-300 leading-relaxed"
                    >
                        Your daily companion for tracking habits, measuring progress,
                        and building a better you.
                    </motion.p>
                </div>
            </div>
        </>
    );
};

export default HomePage;
