'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

interface AnimatedNumberProps {
    to: number;
    className?: string;
    delay?: number;
    formatter?: (value: number) => string;
}

const defaultFormatter = (value: number) => Math.round(value).toLocaleString();

export function AnimatedNumber({ to, className, delay = 0, formatter = defaultFormatter }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const spring = useSpring(0, { 
        stiffness: 100, 
        damping: 30,
        mass: 1 
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            spring.set(to);
        }, delay);

        return () => clearTimeout(timeout);
    }, [to, delay, spring]);

    useEffect(() => {
        const unsubscribe = spring.onChange((value) => {
            setDisplayValue(value);
        });

        return unsubscribe;
    }, [spring]);

    return (
        <motion.p 
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay / 1000 }}
        >
            {formatter(displayValue)}
        </motion.p>
    );
}
