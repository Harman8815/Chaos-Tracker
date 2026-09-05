"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import CELLS from "vanta/dist/vanta.clouds.min";

const VantaBackground: React.FC = () => {
    const vantaRef = useRef<HTMLDivElement>(null);
    const vantaEffect = useRef<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !vantaRef.current) return;

        vantaEffect.current = CELLS({
            el: vantaRef.current,
            THREE: THREE,
            skyColor: 0x05020a,
            cloudColor: 0x3b1568,
            cloudShadowColor: 0x0a0314,
            sunColor: 0xa855f7,
            sunGlowColor: 0x38bdf8,
            sunlightColor: 0x6366f1,
        });

        return () => {
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={vantaRef}
            className="fixed inset-0 -z-50"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -50 }}
        />
    );
};

export default VantaBackground;
