'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { type ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, getFilteredRowModel } from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { getColumns } from './columns'
import { CryptoData } from '@/types'
import { Skeleton } from "@/components/ui/skeleton";
import { getTopCoins, getExchangeRate } from "@/lib/coingecko"; // Import getTopCoins and getExchangeRate

interface MarketDataTableClientProps {
  data: CryptoData[]
  currency: string
}

const ITEMS_PER_LOAD = 20; // Number of items to load at a time

export function MarketDataTableClient({ data: initialData, currency }: MarketDataTableClientProps) {
  const columns = getColumns(currency);
  const [sorting, setSorting] = useState<any>([])
  const [columnFilters, setColumnFilters] = useState<any>([])
  const [displayedData, setDisplayedData] = useState<CryptoData[]>(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Re-initialize displayed data and reset on initialData or currency change
  useEffect(() => {
    setDisplayedData(initialData);
    setPage(1);
    setHasMore(true); // Assume more data initially
  }, [initialData, currency]); // Add currency to dependency array

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const newData = await getTopCoins(nextPage, ITEMS_PER_LOAD); // Fetch in USD
      if (newData && newData.length > 0) {
        // Apply exchange rate to new data
        let exchangeRate = 1;
        if (currency.toLowerCase() !== 'usd') {
          const rate = await getExchangeRate(currency);
          if (rate) {
            exchangeRate = rate;
          } else {
            console.warn(`Failed to fetch exchange rate for ${currency}. Displaying new data in USD.`);
          }
        }

        const convertedNewData = newData.map(coin => ({
          ...coin,
          current_price: coin.current_price * exchangeRate,
          market_cap: coin.market_cap * exchangeRate,
          total_volume: coin.total_volume * exchangeRate,
          high_24h: coin.high_24h * exchangeRate,
          low_24h: coin.low_24h * exchangeRate,
          ath: coin.ath * exchangeRate,
          ath_market_cap: coin.ath_market_cap ? coin.ath_market_cap * exchangeRate : null,
        }));

        setDisplayedData(prevData => [...prevData, ...convertedNewData]);
        setPage(nextPage);
        setHasMore(newData.length === ITEMS_PER_LOAD); // If less than ITEMS_PER_LOAD, no more data
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more data:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore, currency]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 1.0 } // Trigger when 100% of the target is visible
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadingMore, loadMore, observerTarget]);

  const table = useReactTable({
    data: displayedData, // Use displayedData for the table
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari koin..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada hasil.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-4">
          {loadingMore ? (
            <Skeleton className="h-10 w-full max-w-sm" />
          ) : (
            <span className="text-muted-foreground">Memuat lebih banyak...</span>
          )}
        </div>
      )}
    </div>
  )
}