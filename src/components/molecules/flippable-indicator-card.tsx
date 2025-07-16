
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, RefreshCw } from 'lucide-react';
import { AnimatedNumber } from './animated-number'; // Assuming you extract AnimatedNumber

const formatCurrency = (value: number) => {
    if (Math.abs(value) < 1) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(value);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', compactDisplay: 'short' }).format(value);
};

interface FlippableIndicatorCardProps {
    index: number;
    icon: LucideIcon;
    name: string;
    score: number;
    rawData: Record<string, number | string>;
    formula: string;
}

export function FlippableIndicatorCard({
    index,
    icon: Icon,
    name,
    score,
    rawData,
    formula,
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
            className="perspective-1000 h-24"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <motion.div
                className="relative h-full w-full preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
                {/* Card Front */}
                <div className="absolute w-full h-full backface-hidden">
                    <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex flex-1 items-center justify-between gap-4 h-full">
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
                <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)]">
                     <Card className="h-full bg-muted/80 border-primary/20 flex flex-col justify-center cursor-pointer">
                        <CardContent className="p-3 text-center">
                            <div className="space-y-1">
                                {Object.entries(rawData).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-baseline text-xs gap-2">
                                        <span className="text-muted-foreground">{key}:</span>
                                        <span className="font-mono font-medium text-foreground">
                                            {typeof value === 'number' ? formatCurrency(value) : value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-mono text-primary/80 mt-2 truncate" title={formula}>
                                {formula}
                            </p>
                            <RefreshCw className="h-3 w-3 text-muted-foreground absolute bottom-1.5 right-1.5" />
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </motion.div>
    );
}
