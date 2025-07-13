'use client';

import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KlineData } from "@/types";

interface CoinChartProps {
  symbol: string;
  klinesData: KlineData[] | null;
}

const formatCurrency = (value: number, currency: string = 'usd', compact: boolean = false) => {
  if (value === null || isNaN(value)) return 'N/A';
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (compact) {
    options.notation = 'compact';
    options.maximumFractionDigits = 2;
  }
  return new Intl.NumberFormat('en-US', options).format(value);
};

export function CoinChart({ symbol, klinesData }: CoinChartProps) {
  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>Grafik Harga ({symbol?.toUpperCase()}/USDT)</CardTitle>
      </CardHeader>
      <CardContent>
        {klinesData && klinesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={klinesData.map(k => ({ ...k, close: parseFloat(k.close) }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="openTime" tickFormatter={(time) => format(new Date(time), 'dd MMM')} />
              <YAxis domain={['dataMin', 'dataMax']} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => format(new Date(label), 'dd MMM yyyy')} />
              <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-muted-foreground text-center py-8">Tidak ada data grafik yang tersedia.</div>
        )}
      </CardContent>
    </Card>
  );
}
