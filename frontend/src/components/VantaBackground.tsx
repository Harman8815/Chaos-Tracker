"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import CELLS from "vanta/dist/vanta.cells.min";

const VantaBackground: React.FC = () => {
    const pathname = usePathname();
    const vantaRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Exclude Home ('/') and Quotes ('/quotes')
        const isExcluded = pathname === "/" || pathname === "/quotes";

        if (isExcluded) {
            // Destroy vanta if we are on an excluded page
            if (vantaRef.current) {
                console.log("Destroying Vanta Cells (Excluded Page)");
                vantaRef.current.destroy();
                vantaRef.current = null;
            }
            return;
        }

        // Initialize vanta if not already active
        if (!vantaRef.current && containerRef.current) {
            console.log("Initializing Vanta Cells...");
            try {
                vantaRef.current = CELLS({
                    el: containerRef.current,
                    THREE: THREE,
                    mouseControls: false,
                    touchControls: false,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    color1: 0x000000, // Lighter grey for visibility
                    color2: 0xc2ff, // Darker grey
                    size: 1.8,
                    speed: 0.5
                });
                console.log("Vanta Cells Initialized:", vantaRef.current);
            } catch (error) {
                console.error("Failed to initialize Vanta Cells:", error);
            }
        }
    }, [pathname]);


    // Don't render the container if on excluded pages
    if (pathname === "/" || pathname === "/quotes") return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-screen h-screen bg-black pointer-events-none"
            style={{
                zIndex: 0,
            }}
        ></div>
    );
};

export default VantaBackground;
