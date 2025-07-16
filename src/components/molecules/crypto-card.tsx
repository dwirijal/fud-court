
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
    <Card className={cn("flex flex-col justify-between bg-card/60 backdrop-blur-md", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-3 pb-0">
        <div className="flex items-center gap-2">
          <Image
            src={data.image}
            alt={`${data.name} logo`}
            width={20}
            height={20}
            className="rounded-full"
          />
          <CardTitle className="text-xs font-medium">{data.name}</CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">
          {data.symbol.toUpperCase()}
        </span>
      </CardHeader>
      <CardContent className="p-3">
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
                "flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-[hsl(var(--chart-2))]" : "text-destructive"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>{(data.price_change_percentage_24h_in_currency ?? 0).toFixed(2)}%</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
