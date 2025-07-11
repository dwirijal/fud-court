
"use client";

import type { CryptoData } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { CryptoSparkline } from "@/components/molecules/crypto-sparkline";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
};

export function CryptoSparklineCard({ data }: { data: CryptoData }) {
    const priceChange = data.price_change_percentage_7d_in_currency ?? 0;
    const isPositive = priceChange >= 0;
    const sparklineData = data.sparkline_in_7d?.price || [];
    const weekHigh = sparklineData.length > 0 ? Math.max(...sparklineData) : 0;
    const weekLow = sparklineData.length > 0 ? Math.min(...sparklineData) : 0;

    return (
        <Card className="bg-card/60 backdrop-blur-md">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Image src={data.image} alt={`${data.name} logo`} width={40} height={40} />
                        <div>
                            <CardTitle>{data.name}</CardTitle>
                            <CardDescription>{data.symbol.toUpperCase()}</CardDescription>
                        </div>
                    </div>
                     <div
                        className={cn(
                            "flex items-center gap-1 text-sm font-medium",
                            isPositive ? "text-chart-2" : "text-destructive"
                        )}
                        >
                        {isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{priceChange.toFixed(2)}%</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-20 w-full mb-4">
                    <CryptoSparkline data={sparklineData} isPositive={isPositive} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <div>
                        <p>7d Low</p>
                        <p className="font-semibold text-foreground">{formatPrice(weekLow)}</p>
                    </div>
                    <div className="text-right">
                        <p>7d High</p>
                        <p className="font-semibold text-foreground">{formatPrice(weekHigh)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
