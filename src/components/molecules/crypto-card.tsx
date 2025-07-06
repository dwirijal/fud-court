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

export function CryptoCard({ data }: { data: CryptoData }) {
  const isPositive = data.change24h >= 0;

  return (
    <Card className="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{data.name}</CardTitle>
        <span className="text-xs text-muted-foreground">{data.symbol}</span>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              ${data.price.toLocaleString("en-US")}
            </div>
            <div
              className={cn(
                "text-xs flex items-center gap-1",
                isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{data.change24h.toFixed(2)}% (24h)</span>
            </div>
          </div>
          <div className="h-12 w-24">
            <CryptoSparkline data={data.sparkline} isPositive={isPositive} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
