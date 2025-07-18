
'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { CryptoData } from '@/types'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/formatters'

export const getColumns = (currency: string): ColumnDef<CryptoData>[] => {

    const formatPrice = (amount: number) => {
        return formatCurrency(amount, currency);
    }
    
    const formatCompact = (amount: number) => {
        return formatCurrency(amount, currency, true);
    }

    return [
        {
            accessorKey: 'market_cap_rank',
            header: '#',
            cell: ({ row }) => <div className="w-4 text-center text-sm font-medium text-text-tertiary">{row.getValue('market_cap_rank')}</div>,
        },
        {
            accessorKey: 'name',
            header: 'Nama',
            cell: ({ row }) => {
                const crypto = row.original
                return (
                    <Link href={`/coins/${crypto.id}`} className="flex items-center gap-4 hover:underline">
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
                            <div className="font-semibold text-base text-text-primary">{crypto.name || '-'}</div>
                            <div className="text-sm text-text-secondary">
                                {(crypto.symbol || '').toUpperCase() || '-' }
                            </div>
                        </div>
                    </Link>
                )
            },
        },
        {
            accessorKey: 'current_price',
            header: () => <div className="text-right">Harga</div>,
            cell: ({ row }) => {
                const price = parseFloat(row.getValue('current_price'))
                return <div className="font-mono text-right font-medium text-text-primary">{formatPrice(price)}</div>
            },
        },
        {
            accessorKey: 'price_change_percentage_1h_in_currency',
            header: () => <div className="text-right">1j %</div>,
            cell: ({ row }) => {
                const change = row.getValue('price_change_percentage_1h_in_currency') as number | null;
                if (change === null || isNaN(change)) return <div className="font-mono text-right text-text-tertiary">-</div>;
                const isPositive = change >= 0;
                return (
                    <div className={cn('flex items-center justify-end gap-1 font-mono text-right', isPositive ? 'text-market-up' : 'text-market-down')}>
                        {isPositive ? <TrendingUp className="h-4 w-4 shrink-0" /> : <TrendingDown className="h-4 w-4 shrink-0" />}
                        <span>{change.toFixed(2)}%</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'price_change_percentage_24h_in_currency',
            header: () => <div className="text-right">24j %</div>,
            cell: ({ row }) => {
                const change = row.getValue('price_change_percentage_24h_in_currency') as number | null;
                if (change === null || isNaN(change)) return <div className="font-mono text-right text-text-tertiary">-</div>;
                const isPositive = change >= 0;
                return (
                    <div className={cn('flex items-center justify-end gap-1 font-mono text-right', isPositive ? 'text-market-up' : 'text-market-down')}>
                        {isPositive ? <TrendingUp className="h-4 w-4 shrink-0" /> : <TrendingDown className="h-4 w-4 shrink-0" />}
                        <span>{change.toFixed(2)}%</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'price_change_percentage_7d_in_currency',
            header: () => <div className="text-right">7h %</div>,
            cell: ({ row }) => {
                const change = row.getValue('price_change_percentage_7d_in_currency') as number | null;
                if (change === null || isNaN(change)) return <div className="font-mono text-right text-text-tertiary">-</div>;
                const isPositive = change >= 0;
                return (
                    <div className={cn('flex items-center justify-end gap-1 font-mono text-right', isPositive ? 'text-market-up' : 'text-market-down')}>
                        {isPositive ? <TrendingUp className="h-4 w-4 shrink-0" /> : <TrendingDown className="h-4 w-4 shrink-0" />}
                        <span>{change.toFixed(2)}%</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'market_cap',
            header: () => <div className="text-right">Kapitalisasi Pasar</div>,
            cell: ({ row }) => <div className="font-mono text-right text-text-secondary">{formatCompact(row.getValue('market_cap'))}</div>,
        },
        {
            accessorKey: 'total_volume',
            header: () => <div className="text-right">Volume (24j)</div>,
            cell: ({ row }) => <div className="font-mono text-right text-text-secondary">{formatCompact(row.getValue('total_volume'))}</div>,
        },
    ]
}
