
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Separator } from '../ui/separator';

interface FlippableIndicatorCardProps {
    icon: LucideIcon;
    name: string;
    score: number;
    formula: string;
    rawData: Record<string, string | number>;
}

export function FlippableIndicatorCard({
    icon: Icon,
    name,
    score,
    formula,
    rawData,
}: FlippableIndicatorCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="perspective-1000 h-full w-full"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <motion.div
                className="relative h-full w-full preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                {/* Card Front */}
                <div className="absolute w-full h-full backface-hidden">
                    <Card className="h-full bg-bg-secondary hover:bg-bg-tertiary transition-colors cursor-pointer flex flex-col p-4">
                        <div className="flex items-center justify-between gap-4">
                           <p className="body-small font-semibold flex items-center gap-2">
                                <Icon className="h-4 w-4 text-text-tertiary" />
                                {name}
                            </p>
                        </div>
                        <div className="flex-grow flex items-end justify-end">
                            <p className="text-3xl font-mono font-bold">{score}</p>
                        </div>
                    </Card>
                </div>

                {/* Card Back */}
                 <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)]">
                     <Card className="h-full bg-bg-tertiary border-accent-primary/20 flex flex-col justify-center p-3 cursor-pointer">
                        <div className="space-y-1 text-xs w-full">
                          {Object.entries(rawData).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-baseline gap-2">
                              <span className="text-text-secondary truncate" title={key}>{key}</span>
                              <span className="font-mono text-text-primary font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-1.5 bg-accent-primary/20"/>
                        <p className="text-xs text-center font-mono text-accent-primary/80" title={formula}>
                            {formula}
                        </p>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
