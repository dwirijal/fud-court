import { AppShell } from "@/components/organisms/app-shell";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getTopCoins } from "@/lib/coingecko";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

// Helper function to format large numbers
const formatNumber = (num: number) => {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  return `$${num.toLocaleString()}`;
};

export default async function MarketsPage() {
  const cryptoData = await getTopCoins(100);

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-2">
            Crypto Markets
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore real-time cryptocurrency prices, market caps, and trading
            volumes.
          </p>
        </header>

        <Card className="border-none bg-card/50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="w-[50px] pl-6">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h %</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                  <TableHead className="text-right">Volume (24h)</TableHead>
                  <TableHead className="w-[120px] text-right pr-6"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cryptoData.map((crypto, index) => {
                  const isPositive = crypto.price_change_percentage_24h >= 0;
                  return (
                    <TableRow key={crypto.id} className="border-border/50">
                      <TableCell className="font-medium text-muted-foreground pl-6">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={crypto.image}
                            alt={`${crypto.name} logo`}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-bold">{crypto.name}</div>
                            <div className="text-muted-foreground text-sm">
                              {crypto.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        $
                        {crypto.current_price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits:
                            crypto.current_price < 1 ? 6 : 2,
                        })}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-medium tabular-nums",
                          isPositive
                            ? "text-[hsl(var(--chart-2))]"
                            : "text-primary"
                        )}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>
                            {crypto.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(crypto.market_cap)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(crypto.total_volume)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="outline" size="sm">
                          Trade
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}