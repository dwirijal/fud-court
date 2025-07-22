'use client';

import { useEffect, useState } from 'react';
import { CoinGeckoAPI, Coin } from '@/lib/api-clients/crypto/coinGecko';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from '@/components/shared/HeroSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const MAX_COMPARE_COUNT = 5;

export default function CompareCoinsPage() {
  const [allCoins, setAllCoins] = useState<Coin[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [comparedData, setComparedData] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const coinGecko = new CoinGeckoAPI();
        const data = await coinGecko.getCoinsMarkets({
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        });
        setAllCoins(data);
      } catch (err) {
        setError('Failed to fetch coin list.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCoins();
  }, []);

  const handleCheckboxChange = (coinId: string) => {
    setSelectedCoins((prev) => {
      if (prev.includes(coinId)) {
        return prev.filter((id) => id !== coinId);
      } else if (prev.length < MAX_COMPARE_COUNT) {
        return [...prev, coinId];
      }
      return prev;
    });
  };

  const handleCompare = async () => {
    if (selectedCoins.length < 2) {
      setError('Please select at least two coins to compare.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const coinGecko = new CoinGeckoAPI();
      const data = await coinGecko.getCoinsMarkets({
        vs_currency: 'usd',
        ids: selectedCoins.join(','),
      });
      setComparedData(data);
    } catch (err) {
      setError('Failed to fetch comparison data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const comparisonMetrics = [
    { label: 'Price (USD)', value: (c: Coin) => c.current_price?.toFixed(2) },
    { label: 'Market Cap (USD)', value: (c: Coin) => c.market_cap?.toLocaleString() },
    { label: 'Market Cap Rank', value: (c: Coin) => c.market_cap_rank },
    { label: '24h High', value: (c: Coin) => c.high_24h?.toLocaleString() },
    { label: '24h Low', value: (c: Coin) => c.low_24h?.toLocaleString() },
    { label: '24h Price Change', value: (c: Coin) => c.price_change_24h?.toLocaleString() },
    { label: '24h Price Change %', value: (c: Coin) => c.price_change_percentage_24h?.toFixed(2) + '%' },
    { label: 'All-Time High', value: (c: Coin) => c.ath?.toLocaleString() },
    { label: 'All-Time Low', value: (c: Coin) => c.atl?.toLocaleString() },
    { label: 'Circulating Supply', value: (c: Coin) => c.circulating_supply?.toLocaleString() },
    { label: 'Total Supply', value: (c: Coin) => c.total_supply?.toLocaleString() },
  ];

  return (
    <>
      <HeroSection
        title="Compare Cryptocurrencies"
        description="Select up to 5 coins to see a side-by-side comparison of their key metrics."
      />
      <div className="p-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Coins to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allCoins.map((coin) => (
                  <div key={coin.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={coin.id}
                      checked={selectedCoins.includes(coin.id)}
                      onCheckedChange={() => handleCheckboxChange(coin.id)}
                      disabled={!selectedCoins.includes(coin.id) && selectedCoins.length >= MAX_COMPARE_COUNT}
                    />
                    <label htmlFor={coin.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {coin.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button onClick={handleCompare} disabled={selectedCoins.length < 2 || loading}>
                Compare
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {comparedData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    {comparedData.map((coin) => (
                      <TableHead key={coin.id} className="text-right">{coin.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonMetrics.map((metric) => (
                    <TableRow key={metric.label}>
                      <TableCell className="font-medium">{metric.label}</TableCell>
                      {comparedData.map((coin) => (
                        <TableCell key={coin.id} className="text-right">
                          {metric.value(coin) ?? 'N/A'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
