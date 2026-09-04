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

                skyColor: 0x0b041a,
                cloudColor: 0x8b5cf6,
                cloudShadowColor: 0x150a2a,
                sunColor: 0x38bdf8,
                sunGlareColor: 0xa855f7,
                sunlightColor: 0x38bdf8,

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
                <div className="text-center p-8 pointer-events-auto select-none bg-[rgba(15,10,30,0.65)] backdrop-blur-xl border border-[rgba(139,92,246,0.35)] rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.35)]">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-extrabold 
                bg-gradient-to-r from-[#38bdf8] to-[#a855f7]
                bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                    >
                        Welcome
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }
                        }
                        className="text-xl md:text-2xl max-w-md mx-auto mt-5 text-[#e9d5ff] leading-relaxed"
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
