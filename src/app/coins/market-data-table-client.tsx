
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable, 
    getFilteredRowModel, 
    flexRender,
    SortingState,
    ColumnFiltersState
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getColumns } from './columns'
import type { CryptoData } from '@/types'
import { Skeleton } from "@/components/ui/skeleton";
import { getTopCoins, getExchangeRate } from "@/lib/coingecko";

const ITEMS_PER_LOAD = 50;

interface MarketDataTableClientProps {
  initialData: CryptoData[]
  currency: string
  filter: string
}

export function MarketDataTableClient({ initialData, currency, filter }: MarketDataTableClientProps) {
  const [displayedData, setDisplayedData] = useState<CryptoData[]>(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.length >= 20);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const columns = getColumns(currency);

  useEffect(() => {
    setDisplayedData(initialData);
    setPage(1);
    setHasMore(initialData.length >= 20);
  }, [initialData, currency]);

  useEffect(() => {
    setColumnFilters([{ id: 'name', value: filter }]);
  }, [filter]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPageToFetch = page + 1;
    try {
      const newData = await getTopCoins(nextPageToFetch, ITEMS_PER_LOAD);
      
      if (newData && newData.length > 0) {
        let exchangeRate = 1;
        if (currency.toLowerCase() !== 'usd') {
          const rate = await getExchangeRate(currency);
          if (rate) exchangeRate = rate;
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
        setPage(nextPageToFetch);
        setHasMore(newData.length === ITEMS_PER_LOAD);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Gagal memuat data tambahan:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore, currency]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, loadingMore, hasMore]);


  const table = useReactTable({
    data: displayedData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
       <div ref={observerTarget} className="flex justify-center p-4">
          {loadingMore && (
            <div className="w-full space-y-2 p-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {!loadingMore && !hasMore && displayedData.length > 0 && (
             <p className="text-sm text-muted-foreground">Anda telah mencapai akhir daftar.</p>
          )}
      </div>
    </>
  )
}
