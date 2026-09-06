"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CommandPalette } from "@/components/CommandPalette";

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

        return () => {
            if (vantaRef.current) {
                vantaRef.current.destroy();
                vantaRef.current = null;
            }
        };
    }, []);

    return (
        <>
            <div
                ref={containerRef}
                className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
                style={{ position: 'fixed', top: 0, left: 0 }}
            />

            <div className="relative z-10 w-full h-full flex items-center justify-center text-white pointer-events-none p-4">
                <Card className="pointer-events-auto max-w-lg w-full glass shadow-xl animate-fade-in-up">
                    <CardContent className="p-8 text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                        >
                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                                <span className="bg-gradient-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">
                                    Welcome
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-md mx-auto"
                        >
                            Your daily companion for tracking habits, measuring progress,
                            and building a better you.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
                        >
                            <Button size="lg" className="w-full sm:w-auto">
                                Get Started
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                Learn More
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="pt-4"
                        >
                            <CommandPalette />
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default HomePage;

