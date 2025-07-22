'use client';

import { useState, useEffect, useCallback } from 'react';
import { CoinGeckoAPI } from '@/lib/api-clients/crypto/coinGecko';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface SearchCoinResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}

interface CoinListItem {
  id: string;
  name: string;
  symbol: string;
}

export default function CoinSearchPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchCoinResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allCoinsList, setAllCoinsList] = useState<CoinListItem[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<CoinListItem[]>([]);

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
    if (query.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const suggestions = allCoinsList.filter(
      (coin) =>
        coin.name.toLowerCase().includes(lowerCaseQuery) ||
        coin.symbol.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 10); // Limit to 10 suggestions
    setFilteredSuggestions(suggestions);
  }, [query, allCoinsList]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const coinGecko = new CoinGeckoAPI();
      const response = await coinGecko.search(searchQuery);
      setSearchResults(response.coins);
    } catch (err) {
      setError('Failed to perform search.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(query);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [query, handleSearch]);

  const handleSuggestionClick = (coinId: string) => {
    setQuery(coinId);
    handleSearch(coinId);
    setFilteredSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Coin Search</h1>
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by coin name or symbol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-lg"
          />
          {filteredSuggestions.length > 0 && (
            <div className="absolute z-10 bg-background border rounded-md mt-1 w-full max-w-lg max-h-60 overflow-y-auto shadow-lg">
              {filteredSuggestions.map((coin) => (
                <div
                  key={coin.id}
                  className="p-2 cursor-pointer hover:bg-muted flex items-center gap-2"
                  onClick={() => handleSuggestionClick(coin.id)}
                >
                  {coin.name} ({coin.symbol.toUpperCase()})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-lg" />
          <Skeleton className="h-48 w-full max-w-lg" />
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">Error: {error}</div>
      ) : searchResults && searchResults.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Symbol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((coin) => (
                    <TableRow key={coin.id}>
                      <TableCell>{coin.market_cap_rank}</TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/coins/${coin.id}`} className="flex items-center gap-2">
                          {coin.thumb && <Image src={coin.thumb} alt={coin.name} width={20} height={20} className="rounded-full" />}
                          {coin.name}
                        </Link>
                      </TableCell>
                      <TableCell className="uppercase">
                        <Link href={`/coins/${coin.id}`} className="block w-full h-full py-2 px-4">
                          {coin.symbol}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : searchResults && searchResults.length === 0 && query.trim() && !loading ? (
        <div className="p-4 text-muted-foreground">No results found for &quot;{query}&quot;.</div>
      ) : null}
    </div>
  );
}