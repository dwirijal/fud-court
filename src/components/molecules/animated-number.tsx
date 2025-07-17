
'use client';

import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';

interface AnimatedNumberProps {
    to: number;
    className?: string;
    delay?: number;
    formatter?: (value: number) => string;
}

const defaultFormatter = (value: number) => Math.round(value).toLocaleString();

export function AnimatedNumber({ to, className, delay = 0, formatter = defaultFormatter }: AnimatedNumberProps) {
    const [value, setValue] = useState(0);
    const targetRef = useRef({ value: 0 });

    useEffect(() => {
        const target = targetRef.current;
        
        anime.remove(target); // Remove previous animations on this target

        const animation = anime({
            targets: target,
            value: to,
            round: 1,
            duration: 1200,
            delay: delay,
            easing: 'easeOutCubic',
            update: () => {
                setValue(target.value);
            }
        });
        
        return () => {
          animation.pause();
        }

    }, [to, delay]);

    return <p className={className}>{formatter(value)}</p>;
}
