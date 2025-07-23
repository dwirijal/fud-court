
'use client';

import { useState, useEffect, useCallback } from 'react';
import { GeckoTerminalAPI, Pool, Token } from '@/lib/api-clients/crypto/geckoterminal';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/utils';

type SearchResult = (Pool | Token) & { network: string };

export default function DegenSearchPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const api = new GeckoTerminalAPI();
      const response = await api.search({ query: searchQuery, include: ['network'] });
      
      const resultsWithNetwork = response.data.map((item: any) => ({
        ...item,
        network: item.relationships?.network?.data?.id ?? 'unknown'
      }));

      setSearchResults(resultsWithNetwork);
    } catch (err) {
      setError('Failed to perform search.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, handleSearch]);

  const renderRow = (item: SearchResult) => {
    if (item.type === 'token') {
      const token = item as Token & { network: string };
      return (
        <TableRow key={token.id}>
          <TableCell className="font-medium">
            <Link href={`/degen/tokens/${token.attributes.address}`} className="hover:underline">
              {token.attributes.name} ({token.attributes.symbol})
            </Link>
          </TableCell>
          <TableCell>Token</TableCell>
          <TableCell>{token.network}</TableCell>
          <TableCell className="text-right">{formatCurrency(token.attributes.price_usd)}</TableCell>
          <TableCell className="text-right">{formatCurrency(token.attributes.volume_usd?.h24)}</TableCell>
        </TableRow>
      );
    }
    if (item.type === 'pool') {
      const pool = item as Pool & { network: string };
      return (
        <TableRow key={pool.id}>
          <TableCell className="font-medium">
            <Link href={`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`} className="hover:underline">
              {pool.attributes.name}
            </Link>
          </TableCell>
          <TableCell>Pool</TableCell>
          <TableCell>{pool.network}</TableCell>
          <TableCell className="text-right">{formatCurrency(pool.attributes.base_token_price_usd)}</TableCell>
          <TableCell className="text-right">{formatCurrency(pool.attributes.volume_usd.h24)}</TableCell>
        </TableRow>
      );
    }
    return null;
  };
  
  const formatCurrency = (value: string | number | undefined, precision = 2) => {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (num === undefined || num === null) return 'N/A';
      return `$${num.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
  }


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Degen Search</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by token/pool name or address..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-lg"
        />
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <div className="p-4 text-red-500">Error: {error}</div>
      ) : searchResults && searchResults.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Search Results for &quot;{query}&quot;</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead className="text-right">Price (USD)</TableHead>
                    <TableHead className="text-right">24h Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((item) => renderRow(item))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : searchResults && searchResults.length === 0 && query.trim() && !loading ? (
        <div className="p-4 text-center text-muted-foreground">No results found for &quot;{query}&quot;.</div>
      ) : null}
    </div>
  );
}
