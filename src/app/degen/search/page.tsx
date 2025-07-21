'use client';

import { useState, useEffect, useCallback } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';

export default function DegenSearchPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DexScreenerPair[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dexScreener = new DexScreenerClient();
      const response = await dexScreener.search(searchQuery);
      setSearchResults(response.pairs);
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Degen Search</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by token name, symbol, or address..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-lg"
        />
      </div>

      {loading && <div className="p-4">Searching...</div>}
      {error && <div className="p-4 text-red-500">Error: {error}</div>}

      {searchResults && searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pair</TableHead>
                    <TableHead>Chain</TableHead>
                    <TableHead>DEX</TableHead>
                    <TableHead className="text-right">Price (USD)</TableHead>
                    <TableHead className="text-right">24h Change (%)</TableHead>
                    <TableHead className="text-right">24h Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((pair) => (
                    <TableRow key={pair.pairAddress}>
                      <TableCell className="font-medium">
                        <Link href={`/degen/tokens/${pair.baseToken.address}`} className="flex items-center gap-2">
                          {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                        </Link>
                      </TableCell>
                      <TableCell>{pair.chainId}</TableCell>
                      <TableCell>{pair.dexId}</TableCell>
                      <TableCell className="text-right">${parseFloat(pair.priceUsd || '0').toFixed(6)}</TableCell>
                      <TableCell className={cn(
                        "text-right",
                        pair.priceChange.h24 >= 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {pair.priceChange.h24?.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">${pair.volume.h24?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults && searchResults.length === 0 && query.trim() && !loading && (
        <div className="p-4 text-muted-foreground">No results found for &quot;{query}&quot;.</div>
      )}
    </div>
  );
}
