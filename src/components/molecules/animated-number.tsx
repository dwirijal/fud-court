
'use client';

import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';

interface AnimatedNumberProps {
    to: number;
    className?: string;
    delay?: number;
}

export function AnimatedNumber({ to, className, delay = 0 }: AnimatedNumberProps) {
    const [value, setValue] = useState(0);
    const hasAnimated = useRef(false);
    const target = useRef({ value: 0 }).current;

    useEffect(() => {
        if (hasAnimated.current && value === to) {
            return;
        }

        // To handle dynamic changes in 'to' prop
        if(hasAnimated.current) {
             target.value = value;
        }

        hasAnimated.current = true;
        
        anime({
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
    }, [to, delay, target, value]);

    return <p className={className}>{value}</p>;
}
