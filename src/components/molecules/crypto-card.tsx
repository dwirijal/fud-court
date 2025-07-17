
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CryptoData } from "@/types";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

export function CryptoCard({ data, className }: { data: CryptoData, className?: string }) {
  const isPositive = (data.price_change_percentage_24h_in_currency ?? 0) >= 0;

  return (
    <Card className={cn("relative flex flex-col justify-between bg-background/50 backdrop-blur-md h-full overflow-hidden", className)}>
      <Image
        src={data.image}
        alt={`${data.name} background logo`}
        width={128}
        height={128}
        className="absolute -top-10 -left-10 w-32 h-32 opacity-[0.35] rotate-[30deg] rounded-full"
      />
      <div className="relative z-10 flex flex-col h-full">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-2 pb-0 gap-1">
          <div className="flex items-center gap-1">
            <CardTitle className="text-xs font-medium">{data.name}</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">
            {data.symbol.toUpperCase()}
          </span>
        </CardHeader>
        <CardContent className="p-2 flex-grow flex flex-col justify-end">
          <div className="flex items-end justify-between">
              <div className="text-lg font-bold">
                $
                {data.current_price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: data.current_price < 1 ? 6 : 2,
                })}
              </div>
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  isPositive ? "text-chart-2" : "text-destructive"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{(data.price_change_percentage_24h_in_currency ?? 0).toFixed(2)}%</span>
              </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
