'use client';

import { useState } from 'react';
import { usePortfolioTracker } from '@/hooks/use-crypto-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';

interface Holding {
  id: string;
  amount: number;
}

export function PortfolioTracker() {
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: 'bitcoin', amount: 0.5 },
    { id: 'ethereum', amount: 2.0 }
  ]);
  const [newCoin, setNewCoin] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const { data: portfolio, loading, error, refetch } = usePortfolioTracker(holdings);

  const addHolding = () => {
    if (newCoin && newAmount && parseFloat(newAmount) > 0) {
      setHoldings(prev => [...prev, { id: newCoin.toLowerCase(), amount: parseFloat(newAmount) }]);
      setNewCoin('');
      setNewAmount('');
    }
  };

  const removeHolding = (index: number) => {
    setHoldings(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-skeleton h-20 w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-status-error">Error: {error}</p>
          <Button onClick={refetch} className="mt-2">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Tracker</CardTitle>
        <p className="text-text-secondary">Track your crypto holdings in real-time</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {portfolio && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-secondary p-4 rounded-lg">
              <p className="text-text-secondary text-sm">Total Value</p>
              <p className="text-2xl font-bold text-text-primary">
                ${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-bg-secondary p-4 rounded-lg">
              <p className="text-text-secondary text-sm">24h Change</p>
              <p className={`text-2xl font-bold ${portfolio.totalChange24h >= 0 ? 'text-market-up' : 'text-market-down'}`}>
                {portfolio.totalChange24h >= 0 ? '+' : ''}${portfolio.totalChange24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm ml-1">
                  ({((portfolio.totalChange24h / portfolio.totalValue) * 100).toFixed(2)}%)
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold">Holdings</h4>
          {portfolio?.coins.map((coin, index) => (
            <div key={coin.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
              <div className="flex-1">
                <p className="font-medium capitalize">{coin.id}</p>
                <p className="text-sm text-text-secondary">{coin.amount} coins</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${coin.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <Badge variant={coin.price_change_percentage_24h >= 0 ? 'default' : 'destructive'}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeHolding(index)}
                className="ml-2"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Coin ID (e.g., bitcoin)"
            value={newCoin}
            onChange={(e) => setNewCoin(e.target.value)}
          />
          <Input
            placeholder="Amount"
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <Button onClick={addHolding}>
            <Plus size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
