import { AppShell } from "@/components/organisms/app-shell";
import { CryptoSparkline } from "@/components/molecules/crypto-sparkline";
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
import type { CryptoData } from "@/types";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

// Expanded mock data for the markets page
const MOCK_MARKETS_DATA: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 67123.45,
    change24h: 2.5,
    marketCap: 1320000000000,
    volume24h: 45000000000,
    sparkline: [3, 5, 4, 6, 7, 5, 8, 9, 8, 10],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change24h: -1.2,
    marketCap: 415200000000,
    volume24h: 22000000000,
    sparkline: [9, 8, 9, 7, 6, 8, 7, 5, 6, 4],
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 145.67,
    change24h: 5.8,
    marketCap: 67100000000,
    volume24h: 3500000000,
    sparkline: [3, 4, 5, 4, 6, 7, 8, 9, 10, 12],
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    price: 1.0,
    change24h: 0.01,
    marketCap: 112000000000,
    volume24h: 90000000000,
    sparkline: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    price: 590.12,
    change24h: 1.5,
    marketCap: 87000000000,
    volume24h: 2100000000,
    sparkline: [6, 7, 6, 8, 7, 8, 9, 8, 9, 8],
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    price: 0.52,
    change24h: -0.8,
    marketCap: 28700000000,
    volume24h: 1200000000,
    sparkline: [6, 5, 6, 5, 6, 5, 6, 5, 5, 5],
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    change24h: 0.5,
    marketCap: 16200000000,
    volume24h: 500000000,
    sparkline: [5, 6, 5, 6, 5, 7, 6, 7, 6, 7],
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.16,
    change24h: 3.2,
    marketCap: 23000000000,
    volume24h: 1800000000,
    sparkline: [4, 5, 4, 6, 5, 7, 8, 7, 8, 9],
  },
  {
    id: "avalanche-2",
    name: "Avalanche",
    symbol: "AVAX",
    price: 35.8,
    change24h: -2.1,
    marketCap: 14100000000,
    volume24h: 800000000,
    sparkline: [8, 7, 8, 7, 6, 7, 6, 5, 6, 5],
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    price: 17.5,
    change24h: 4.1,
    marketCap: 10200000000,
    volume24h: 600000000,
    sparkline: [5, 6, 7, 6, 8, 9, 8, 9, 10, 11],
  },
];

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

export default function MarketsPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-2">
            Crypto Markets
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
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
                  <TableHead className="w-[150px] text-center">
                    Last 7 Days
                  </TableHead>
                  <TableHead className="w-[120px] text-right pr-6"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MARKETS_DATA.map((crypto, index) => {
                  const isPositive = crypto.change24h >= 0;
                  return (
                    <TableRow key={crypto.id} className="border-border/50">
                      <TableCell className="font-medium text-muted-foreground pl-6">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-bold">{crypto.name}</div>
                            <div className="text-muted-foreground text-sm">
                              {crypto.symbol}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        $
                        {crypto.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
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
                          <span>{crypto.change24h.toFixed(2)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(crypto.marketCap)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(crypto.volume24h)}
                      </TableCell>
                      <TableCell>
                        <div className="h-12 w-full max-w-[150px] mx-auto">
                          <CryptoSparkline
                            data={crypto.sparkline}
                            isPositive={isPositive}
                          />
                        </div>
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
