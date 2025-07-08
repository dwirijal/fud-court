'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { CryptoData } from '@/types'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const formatNumber = (num: number) => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`
    }
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`
    }
    return `$${num.toLocaleString()}`
}

const PriceChangeCell = ({ value }: { value: number | null | undefined }) => {
    const change = value;
  
    if (change === null || change === undefined || isNaN(change)) {
      return <div className="font-mono text-right text-muted-foreground">-</div>;
    }
  
    const isPositive = change >= 0;
  
    return (
      <div
        className={cn(
          'flex items-center justify-end gap-1 font-mono text-right',
          isPositive ? 'text-chart-2' : 'text-destructive'
        )}
      >
        {isPositive ? <TrendingUp className="h-4 w-4 shrink-0" /> : <TrendingDown className="h-4 w-4 shrink-0" />}
        <span>{change.toFixed(2)}%</span>
      </div>
    );
  };


export const columns: ColumnDef<CryptoData>[] = [
    {
        accessorKey: 'market_cap_rank',
        header: '#',
        cell: ({ row }) => <div className="w-4 text-center font-mono text-sm text-muted-foreground">{row.getValue('market_cap_rank')}</div>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const crypto = row.original
            return (
                <div className="flex items-center gap-4">
                    <Image
                        src={crypto.image}
                        alt={`${crypto.name} logo`}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                    />
                    <div className="flex flex-col">
                        <div className="font-semibold text-base">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {crypto.symbol.toUpperCase()}
                        </div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: 'current_price',
        header: () => <div className="text-right">Price</div>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('current_price'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: price < 1 ? 6 : 2,
            }).format(price)
            return <div className="font-mono text-right">{formatted}</div>
        },
    },
    {
        accessorKey: 'price_change_percentage_1h_in_currency',
        header: () => <div className="text-right">1h %</div>,
        cell: ({ row }) => <PriceChangeCell value={row.getValue('price_change_percentage_1h_in_currency')} />,
    },
    {
        accessorKey: 'price_change_percentage_24h_in_currency',
        header: () => <div className="text-right">24h %</div>,
        cell: ({ row }) => <PriceChangeCell value={row.getValue('price_change_percentage_24h_in_currency')} />,
    },
    {
        accessorKey: 'price_change_percentage_7d_in_currency',
        header: () => <div className="text-right">7d %</div>,
        cell: ({ row }) => <PriceChangeCell value={row.getValue('price_change_percentage_7d_in_currency')} />,
    },
    {
        accessorKey: 'market_cap',
        header: () => <div className="text-right">Market Cap</div>,
        cell: ({ row }) => <div className="font-mono text-right text-muted-foreground">{formatNumber(row.getValue('market_cap'))}</div>,
    },
    {
        accessorKey: 'total_volume',
        header: () => <div className="text-right">Volume (24h)</div>,
        cell: ({ row }) => <div className="font-mono text-right text-muted-foreground">{formatNumber(row.getValue('total_volume'))}</div>,
    },
]
