'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';

export default function DefiYieldPage() {
  const [yieldPools, setYieldPools] = useState([]);
  const [filteredPools, setFilteredPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [chain, setChain] = useState('');

  useEffect(() => {
    const fetchYieldPools = async () => {
      try {
        const res = await fetch('https://yields.llama.fi/pools');
        const { data } = await res.json();
        const filtered = data.filter(p => p.apy > 0 && p.tvlUsd > 100000);
        setYieldPools(filtered);
        setFilteredPools(filtered);
      } catch (err) {
        console.error('Failed to fetch yield data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchYieldPools();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const result = yieldPools.filter(p =>
      (!search || p.project.toLowerCase().includes(query)) &&
      (!chain || p.chain === chain)
    );
    setFilteredPools(result);
  }, [search, chain, yieldPools]);

  const chains = [...new Set(yieldPools.map(p => p.chain))].filter(Boolean);

  const renderTrend = (cls, prob) => {
    const color = {
      bullish: 'green',
      bearish: 'red',
      stable: 'gray'
    }[cls] || 'gray';
    return (
      <Badge variant="outline" className={cn(`border-${color}-500`, `text-${color}-600`)}> 
        {cls} ({(prob * 100).toFixed(0)}%)
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">DeFi Yield Pools</h1>
      <div className="flex flex-wrap gap-4">
        <Input placeholder="Search project..." value={search} onChange={e => setSearch(e.target.value)} className="w-60" />
        <Select onValueChange={setChain} value={chain}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Chains</SelectItem>
            {chains.map(c => (
              c ? <SelectItem key={c} value={c}>{c}</SelectItem> : null
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Yield Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Chain</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">TVL</TableHead>
                    <TableHead className="text-right">APY</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPools.map(pool => (
                    <TableRow key={pool.pool}>
                      <TableCell>
                        <Link href={`/defi/yield/${pool.pool}`} className="text-blue-600 hover:underline block w-full h-full py-2 px-4">
                          {pool.project}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/defi/yield/${pool.pool}`} className="block w-full h-full py-2 px-4">
                          {pool.chain}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/defi/yield/${pool.pool}`} className="block w-full h-full py-2 px-4">
                          {pool.symbol}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/defi/yield/${pool.pool}`} className="block w-full h-full py-2 px-4">
                          ${pool.tvlUsd.toLocaleString()}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        <Link href={`/defi/yield/${pool.pool}`} className="block w-full h-full py-2 px-4">
                          {pool.apy.toFixed(2)}%
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/defi/yield/${pool.pool}`} className="block w-full h-full py-2 px-4">
                          {pool.rewardTokens?.join(', ') || 'N/A'}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/defi/yield/${pool.pool}`} className="block w-full h-full py-2 px-4">
                          {pool.predictions?.predictedClass && pool.predictions?.predictedProbability
                            ? renderTrend(pool.predictions.predictedClass, pool.predictions.predictedProbability)
                            : '—'}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
