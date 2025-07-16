
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { AnimatedNumber } from './animated-number';
import { Separator } from '../ui/separator';

interface FlippableIndicatorCardProps {
    index: number;
    icon: LucideIcon;
    name: string;
    score: number;
    formula: string;
    rawData: Record<string, string | number>;
}

export function FlippableIndicatorCard({
    index,
    icon: Icon,
    name,
    score,
    formula,
    rawData,
}: FlippableIndicatorCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={cardVariants}
            className="perspective-1000 h-24" // Set a fixed height for consistency
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <motion.div
                className="relative h-full w-full preserve-3d"
                animate={{ rotateX: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
                {/* Card Front */}
                <div className="absolute w-full h-full backface-hidden">
                    <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer flex flex-col">
                        <CardContent className="p-4 flex-1 flex items-center justify-between gap-4">
                            <div className="space-y-1 flex-grow">
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    {name}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0 pl-2">
                                <AnimatedNumber to={score} className="text-2xl font-mono font-bold" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Card Back */}
                <div className="absolute w-full h-full backface-hidden [transform:rotateX(180deg)]">
                     <Card className="h-full bg-muted/80 border-primary/20 flex flex-col justify-center p-3 cursor-pointer">
                        <div className="space-y-1 text-xs w-full">
                          {Object.entries(rawData).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-baseline border-b border-border/20 pb-1">
                              <span className="text-muted-foreground truncate" title={key}>{key}</span>
                              <span className="font-mono text-foreground font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-1.5 bg-primary/20"/>
                        <p className="text-xs text-center font-mono text-primary/80" title={formula}>
                            {formula}
                        </p>
                    </Card>
                </div>
            </motion.div>
        </motion.div>
    );
}
