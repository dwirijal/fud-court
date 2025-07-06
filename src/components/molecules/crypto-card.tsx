import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CryptoSparkline } from "@/components/molecules/crypto-sparkline";
import type { CryptoData } from "@/types";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

export function CryptoCard({ data, className }: { data: CryptoData, className?: string }) {
  const isPositive = data.price_change_percentage_24h >= 0;

  return (
    <Card className={cn("flex flex-col justify-between transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Image
            src={data.image}
            alt={`${data.name} logo`}
            width={24}
            height={24}
            className="rounded-full"
          />
          <CardTitle className="text-sm font-medium">{data.name}</CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">
          {data.symbol.toUpperCase()}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              $
              {data.current_price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: data.current_price < 1 ? 6 : 2,
              })}
            </div>
            <div
              className={cn(
                "text-xs flex items-center gap-1",
                isPositive ? "text-[hsl(var(--chart-2))]" : "text-primary"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{data.price_change_percentage_24h.toFixed(2)}% (24h)</span>
            </div>
          </div>
          <div className="h-12 w-24">
            <CryptoSparkline
              data={data.sparkline_in_7d.price}
              isPositive={isPositive}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
