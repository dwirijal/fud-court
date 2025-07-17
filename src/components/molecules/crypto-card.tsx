
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
    <Card className={cn("relative flex flex-col justify-between h-full overflow-hidden transition-all duration-normal hover:-translate-y-px hover:shadow-lg", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-0">
          <div className="flex items-center gap-2">
            <Image src={data.image} alt={`${data.name} logo`} width={24} height={24} className="rounded-full" />
            <CardTitle className="body-small font-semibold">{data.name}</CardTitle>
          </div>
          <span className="caption-regular text-text-tertiary">
            {data.symbol.toUpperCase()}
          </span>
        </CardHeader>
        <CardContent className="p-3 flex-grow flex flex-col justify-end">
          <div className="flex items-end justify-between">
              <div className="number-regular">
                $
                {data.current_price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: data.current_price < 1 ? 6 : 2,
                })}
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 caption-regular",
                  isPositive ? "text-market-up" : "text-market-down"
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
    </Card>
  );
}
