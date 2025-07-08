import type { MoralisTrendingToken } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingDown, TrendingUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrendingTokenCard({ token }: { token: MoralisTrendingToken }) {
  const priceChange = parseFloat(token.price_change_24h);
  const isPositive = priceChange >= 0;

  return (
    <Card className="bg-card/60 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-lg font-bold text-muted-foreground w-6 text-center">
            {token.rank}
          </span>
          <Avatar>
            {token.logo ? (
              <AvatarImage src={token.logo} alt={`${token.name} logo`} />
            ) : null }
            <AvatarFallback>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow overflow-hidden">
            <CardTitle className="text-base font-bold truncate" title={token.name}>
                {token.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground truncate">{token.symbol}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-12">
        <div className="flex justify-between items-baseline">
            <p className="text-base font-mono font-semibold">
                ${parseFloat(token.price_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
            </p>
            <div
                className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive ? "text-chart-2" : "text-destructive"
                )}
            >
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{priceChange.toFixed(2)}%</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
