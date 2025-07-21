'use client';

import { useEffect, useState } from 'react';
import { FearGreedClient, FearGreedData } from '@/lib/api-clients/alternative/fearGreed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/utils';

export default function FearGreedPage() {
  const [fearGreedData, setFearGreedData] = useState<FearGreedData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFearGreedData = async () => {
      try {
        const client = new FearGreedClient();
        // Fetch the latest 10 results
        const response = await client.getFearAndGreedIndex({ limit: 10 });
        setFearGreedData(response.data);
      } catch (err) {
        setError('Failed to fetch Fear & Greed Index data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFearGreedData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading Fear & Greed Index...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!fearGreedData || fearGreedData.length === 0) {
    return <div className="p-4">No Fear & Greed Index data available.</div>;
  }

  const latestIndex = fearGreedData[0];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fear & Greed Index</h1>
      
      <Card className={cn(
        "w-full max-w-md mx-auto",
        latestIndex.value_classification === 'Extreme Fear' && 'bg-red-700 text-white',
        latestIndex.value_classification === 'Fear' && 'bg-orange-500 text-white',
        latestIndex.value_classification === 'Neutral' && 'bg-yellow-500 text-black',
        latestIndex.value_classification === 'Greed' && 'bg-green-500 text-white',
        latestIndex.value_classification === 'Extreme Greed' && 'bg-green-700 text-white',
      )}>
        <CardHeader>
          <CardTitle className="text-center text-3xl">{latestIndex.value_classification}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-5xl font-bold mb-2">{latestIndex.value}</p>
          <p className="text-sm">Last updated: {new Date(parseInt(latestIndex.timestamp) * 1000).toLocaleString()}</p>
          {latestIndex.time_until_update && (
            <p className="text-xs mt-1">Next update in: {Math.floor(parseInt(latestIndex.time_until_update) / 3600)}h {Math.floor((parseInt(latestIndex.time_until_update) % 3600) / 60)}m</p>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mt-8 mb-4">Historical Data</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Classification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fearGreedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(parseInt(item.timestamp) * 1000).toLocaleDateString()}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell>{item.value_classification}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
