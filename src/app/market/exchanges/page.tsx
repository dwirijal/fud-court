'use client';

import { useEffect, useState } from 'react';
import { BinanceAPI, BinanceSymbol } from '@/lib/api-clients/crypto/binance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function ExchangesPage() {
  const [exchangeInfo, setExchangeInfo] = useState<BinanceSymbol[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeInfo = async () => {
      try {
        const binance = new BinanceAPI();
        const data = await binance.getExchangeInfo();
        setExchangeInfo(data.symbols);
      } catch (err) {
        setError('Failed to fetch exchange info from Binance.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeInfo();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading || !exchangeInfo) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Binance Exchange Overview</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-4" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Binance Exchange Overview</h1>
      <Card>
        <CardHeader>
          <CardTitle>Trading Pairs ({exchangeInfo.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Base Asset</TableHead>
                  <TableHead>Quote Asset</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Types</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchangeInfo.slice(0, 50).map((symbol) => (
                  <TableRow key={symbol.symbol}>
                    <TableCell className="font-medium">{symbol.symbol}</TableCell>
                    <TableCell>{symbol.baseAsset}</TableCell>
                    <TableCell>{symbol.quoteAsset}</TableCell>
                    <TableCell>{symbol.status}</TableCell>
                    <TableCell>{symbol.orderTypes.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Showing first 50 trading pairs. Total: {exchangeInfo.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}