'use client';

import { useState, useEffect, useCallback } from 'react';
import { CoinGeckoAPI, Coin } from '@/lib/api-clients/crypto/coinGecko';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';
import Image from 'next/image';

export default function CoinComparePage() {
  const [selectedCoinIds, setSelectedCoinIds] = useState<string[]>([]);
  const [availableCoins, setAvailableCoins] = useState<{ id: string; name: string; symbol: string }[]>([]);
  const [compareCoinsData, setCompareCoinsData] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coinInput, setCoinInput] = useState('');

  // Fetch all available coins for selection
  useEffect(() => {
    const fetchCoinList = async () => {
      try {
        const coinGecko = new CoinGeckoAPI();
        const list = await coinGecko.getCoinsList();
        setAvailableCoins(list);
      } catch (err) {
        console.error('Failed to fetch coin list:', err);
      }
    };
    fetchCoinList();
  }, []);

  const handleAddCoin = useCallback(() => {
    const normalizedInput = coinInput.toLowerCase().trim();
    const foundCoin = availableCoins.find(
      (coin) => coin.id === normalizedInput || coin.symbol === normalizedInput
    );

    if (foundCoin && !selectedCoinIds.includes(foundCoin.id)) {
      setSelectedCoinIds((prev) => [...prev, foundCoin.id]);
      setCoinInput('');
    } else if (selectedCoinIds.includes(foundCoin?.id || '')) {
      alert('Coin already selected!');
    } else {
      alert('Coin not found. Please enter a valid CoinGecko ID or symbol.');
    }
  }, [coinInput, availableCoins, selectedCoinIds]);

  const handleRemoveCoin = useCallback((idToRemove: string) => {
    setSelectedCoinIds((prev) => prev.filter((id) => id !== idToRemove));
  }, []);

  // Fetch data for selected coins
  useEffect(() => {
    const fetchCompareData = async () => {
      if (selectedCoinIds.length === 0) {
        setCompareCoinsData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const coinGecko = new CoinGeckoAPI();
        const data = await coinGecko.getCoinsMarkets({
          vs_currency: 'usd',
          ids: selectedCoinIds.join(','),
          price_change_percentage: '24h,7d',
        });
        setCompareCoinsData(data);
      } catch (err) {
        setError('Failed to fetch comparison data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompareData();
  }, [selectedCoinIds]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Compare Cryptocurrencies</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select Coins to Compare</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter CoinGecko ID or symbol (e.g., bitcoin, btc)"
              value={coinInput}
              onChange={(e) => setCoinInput(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleAddCoin}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCoinIds.map((id) => (
              <Button key={id} variant="outline" size="sm" onClick={() => handleRemoveCoin(id)}>
                {availableCoins.find(c => c.id === id)?.name || id} (x)
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading && <div className="p-4">Loading comparison data...</div>}
      {error && <div className="p-4 text-red-500">Error: {error}</div>}

      {compareCoinsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coin</TableHead>
                    <TableHead className="text-right">Price (USD)</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                    <TableHead className="text-right">24h Change (%)</TableHead>
                    <TableHead className="text-right">7d Change (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compareCoinsData.map((coin) => (
                    <TableRow key={coin.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {coin.image && <Image src={coin.image} alt={coin.name} width={20} height={20} className="rounded-full" />}
                          {coin.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${coin.current_price?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${coin.market_cap?.toLocaleString()}</TableCell>
                      <TableCell className={cn(
                        "text-right",
                        coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </TableCell>
                      <TableCell className={cn(
                        "text-right",
                        coin.price_change_percentage_7d_in_currency >= 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedCoinIds.length > 0 && compareCoinsData.length === 0 && !loading && !error && (
        <div className="p-4 text-muted-foreground">No comparison data available for selected coins.</div>
      )}
    </div>
  );
}
