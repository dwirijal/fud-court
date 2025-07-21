'use client';

import { useEffect, useState, useCallback } from 'react';
import { CoinGeckoAPI, Coin } from '@/lib/api-clients/crypto/coinGecko';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';
import Image from 'next/image';

interface CoinListItem {
  id: string;
  name: string;
  symbol: string;
}

export default function WatchlistPage() {
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [watchlistCoins, setWatchlistCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCoinId, setNewCoinId] = useState('');
  const [allCoinsList, setAllCoinsList] = useState<CoinListItem[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<CoinListItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('crypto_watchlist');
    if (savedWatchlist) {
      setWatchlistIds(JSON.parse(savedWatchlist));
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crypto_watchlist', JSON.stringify(watchlistIds));
  }, [watchlistIds]);

  // Fetch all coins list for suggestions
  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const coinGecko = new CoinGeckoAPI();
        const list = await coinGecko.getCoinsList();
        setAllCoinsList(list);
      } catch (err) {
        console.error('Failed to fetch all coins list:', err);
      }
    };
    fetchAllCoins();
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (newCoinId.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    const lowerCaseQuery = newCoinId.toLowerCase();
    const suggestions = allCoinsList.filter(
      (coin) =>
        coin.name.toLowerCase().includes(lowerCaseQuery) ||
        coin.symbol.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 10); // Limit to 10 suggestions
    setFilteredSuggestions(suggestions);
  }, [newCoinId, allCoinsList]);

  const fetchWatchlistCoins = useCallback(async () => {
    if (watchlistIds.length === 0) {
      setWatchlistCoins([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const coinGecko = new CoinGeckoAPI();
      const data = await coinGecko.getCoinsMarkets({
        vs_currency: 'usd',
        ids: watchlistIds.join(','),
        order: 'market_cap_desc',
        sparkline: false,
        price_change_percentage: '24h',
      });
      setWatchlistCoins(data);
    } catch (err) {
      setError('Failed to fetch watchlist data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [watchlistIds]);

  // Fetch watchlist coins whenever watchlistIds changes
  useEffect(() => {
    fetchWatchlistCoins();
    // Set up interval for real-time updates (e.g., every 30 seconds)
    const interval = setInterval(fetchWatchlistCoins, 30000);
    return () => clearInterval(interval);
  }, [fetchWatchlistCoins]);

  const handleAddCoin = async (coinIdToAdd?: string) => {
    const idToAdd = coinIdToAdd || newCoinId.toLowerCase().trim();
    if (!idToAdd) return;

    const foundCoin = allCoinsList.find(coin => coin.id === idToAdd || coin.symbol === idToAdd);

    if (foundCoin && !watchlistIds.includes(foundCoin.id)) {
      setWatchlistIds((prev) => [...prev, foundCoin.id]);
      setNewCoinId('');
      setFilteredSuggestions([]); // Clear suggestions after adding
    } else if (watchlistIds.includes(foundCoin?.id || '')) {
      alert('Coin already in watchlist!');
    } else {
      alert('Coin not found. Please enter a valid CoinGecko ID or select from suggestions.');
    }
  };

  const handleRemoveCoin = (idToRemove: string) => {
    setWatchlistIds((prev) => prev.filter((id) => id !== idToRemove));
  };

  if (loading) {
    return <div className="p-4">Loading watchlist...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Coin to Watchlist</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="relative flex gap-2">
            <Input
              type="text"
              placeholder="Enter CoinGecko ID or symbol (e.g., bitcoin, btc)"
              value={newCoinId}
              onChange={(e) => setNewCoinId(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={() => handleAddCoin()}>Add Coin</Button>
          </div>
          {filteredSuggestions.length > 0 && (
            <div className="absolute z-10 bg-background border rounded-md mt-1 w-[calc(100%-1rem)] max-h-60 overflow-y-auto shadow-lg">
              {filteredSuggestions.map((coin) => (
                <div
                  key={coin.id}
                  className="p-2 cursor-pointer hover:bg-muted flex items-center gap-2"
                  onClick={() => handleAddCoin(coin.id)}
                >
                  {coin.name} ({coin.symbol.toUpperCase()})
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {watchlistCoins.length === 0 ? (
        <div className="p-4 text-muted-foreground">Your watchlist is empty. Add some coins!</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                <TableHead className="text-right">24h Change (%)</TableHead>
                <TableHead className="text-right">Market Cap (USD)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlistCoins.map((coin) => (
                <TableRow key={coin.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {coin.image && <Image src={coin.image} alt={coin.name} width={20} height={20} className="rounded-full" />}
                      {coin.name}
                    </div>
                  </TableCell>
                  <TableCell className="uppercase">{coin.symbol}</TableCell>
                  <TableCell className="text-right">${coin.current_price?.toFixed(2)}</TableCell>
                  <TableCell className={cn(
                    "text-right",
                    coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">${coin.market_cap?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveCoin(coin.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}