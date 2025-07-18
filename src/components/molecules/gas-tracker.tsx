'use client';

import { useGasTracker } from '@/hooks/use-crypto-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fuel, RefreshCw } from 'lucide-react';

const chainNames: { [key: number]: string } = {
  1: 'Ethereum',
  56: 'BSC',
  137: 'Polygon',
  250: 'Fantom',
  43114: 'Avalanche',
  42161: 'Arbitrum',
  10: 'Optimism'
};

export function GasTracker() {
  const { data: gasPrices, loading, error, refetch } = useGasTracker();

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel size={20} />
            <CardTitle>Gas Tracker</CardTitle>
          </div>
          <RefreshCw className="animate-spin" size={16} />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-skeleton h-16 w-full rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel size={20} />
            <CardTitle>Gas Tracker</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-status-error">Error: {error}</p>
          <Button onClick={refetch} className="mt-2">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const getGasColor = (price: number) => {
    if (price < 20) return 'text-market-up';
    if (price < 50) return 'text-market-neutral';
    return 'text-market-down';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Fuel size={20} />
          <CardTitle>Gas Tracker</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={refetch}>
          <RefreshCw size={16} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {gasPrices?.map((gas) => (
            <div key={gas.chainId} className="bg-bg-secondary p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{chainNames[gas.chainId] || `Chain ${gas.chainId}`}</h4>
                <Badge variant="outline">Chain {gas.chainId}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <p className="text-text-secondary">Standard</p>
                  <p className={`font-bold ${getGasColor(gas.standard)}`}>{gas.standard} gwei</p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary">Fast</p>
                  <p className={`font-bold ${getGasColor(gas.fast)}`}>{gas.fast} gwei</p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary">Instant</p>
                  <p className={`font-bold ${getGasColor(gas.instant)}`}>{gas.instant} gwei</p>
                </div>
              </div>
            </div>
          )) || (
            <p className="text-text-secondary text-center py-4">No gas data available</p>
          )}
        </div>
        <p className="text-xs text-text-tertiary mt-3 text-center">
          Updates every minute • Green: Low • Red: High
        </p>
      </CardContent>
    </Card>
  );
}
