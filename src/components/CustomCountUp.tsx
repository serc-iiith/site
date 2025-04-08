'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Custom animated counter component
interface AnimatedCounterProps {
    value: string;
    title: string;
    icon: React.ReactNode;
    customStyle?: string; // Make customStyle optional with a proper type
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, title, icon, customStyle }) => {
    const [count, setCount] = useState<number>(0);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            const num = parseInt(typeof value === 'string' ? value : '0');

            // Only start animation when in view
            if (num == 0) return;

            // Animate counter
            let animationFrame: number;
            const startTime = Date.now();
            const duration = 1300;

            const updateCounter = () => {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentValue = Math.floor(num * progress);

                setCount(currentValue);

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(updateCounter);
                }
            };

            animationFrame = requestAnimationFrame(updateCounter);

            return () => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            };
        }
    }, [value, inView]);

    return (
        <motion.div
            ref={ref}
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-4xl text-primary mb-2">{icon}</div>
            <div className={`text-4xl font-bold ${customStyle || 'text-text'}`}>
                {count}
            </div>
            <p className="text-gray-500 text-center mt-1">{title}</p>
        </motion.div>
    );
};

export default AnimatedCounter;