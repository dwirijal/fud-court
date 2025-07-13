
'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { CryptoData } from '@/types'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const getLocaleForCurrency = (currency: string) => {
    switch (currency.toLowerCase()) {
        case 'idr':
            return 'id-ID';
        case 'eur':
            return 'de-DE'; // Using German locale for Euro formatting
        case 'usd':
        default:
            return 'en-US';
    }
}

const formatCurrency = (amount: number, currency: string) => {
    if (currency.toLowerCase() === 'xau') {
      const formattedAmount = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `XAU ${formattedAmount}`;
    }

    const locale = getLocaleForCurrency(currency);

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
const formatPrice = (price: number, currency: string) => {
    if (currency.toLowerCase() === 'xau') {
        const formattedPrice = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
        }).format(price);
        return `XAU ${formattedPrice}`;
    }

    const locale = getLocaleForCurrency(currency);
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
};

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


export const getColumns = (currency: string): ColumnDef<CryptoData>[] => [
    {
        accessorKey: 'market_cap_rank',
        header: '#',
        cell: ({ row }) => <div className="w-4 text-center font-mono text-sm text-muted-foreground">{row.getValue('market_cap_rank')}</div>,
    },
    {
        accessorKey: 'name',
        header: 'Nama',
        cell: ({ row }) => {
            const crypto = row.original
            return (
                <div className="flex items-center gap-4">
                    {crypto.image ? (
                        <Image
                            src={crypto.image}
                            alt={`${crypto.name || 'Crypto'} logo`}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-muted" />
                    )}
                    <div className="flex flex-col">
                        <div className="font-semibold text-base">{crypto.name || '-'}</div>
                        <div className="text-sm text-muted-foreground">
                            {(crypto.symbol || '').toUpperCase() || '-' }
                        </div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: 'current_price',
        header: () => <div className="text-right">Harga</div>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('current_price'))
            return <div className="font-mono text-right">{formatPrice(price, currency)}</div>
        },
    },
    {
        accessorKey: 'price_change_percentage_1h_in_currency',
        header: () => <div className="text-right">1j %</div>,
        cell: ({ row }) => <PriceChangeCell value={row.getValue('price_change_percentage_1h_in_currency')} />,
    },
    {
        accessorKey: 'price_change_percentage_24h_in_currency',
        header: () => <div className="text-right">24j %</div>,
        cell: ({ row }) => <PriceChangeCell value={row.getValue('price_change_percentage_24h_in_currency')} />,
    },
    {
        accessorKey: 'price_change_percentage_7d_in_currency',
        header: () => <div className="text-right">7h %</div>,
        cell: ({ row }) => <PriceChangeCell value={row.getValue('price_change_percentage_7d_in_currency')} />,
    },
    {
        accessorKey: 'market_cap',
        header: () => <div className="text-right">Kapitalisasi Pasar</div>,
        cell: ({ row }) => <div className="font-mono text-right text-muted-foreground">{formatCurrency(row.getValue('market_cap'), currency)}</div>,
    },
    {
        accessorKey: 'total_volume',
        header: () => <div className="text-right">Volume (24j)</div>,
        cell: ({ row }) => <div className="font-mono text-right text-muted-foreground">{formatCurrency(row.getValue('total_volume'), currency)}</div>,
    },
]
