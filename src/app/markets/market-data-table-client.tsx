'use client'

import { DataTable } from "@/components/ui/data-table";
import { CryptoData } from "@/types";
import { getColumns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketDataTableClient({ data, currency }: { data: CryptoData[], currency: string }) {
  const columns = getColumns(currency);
  return <DataTable columns={columns} data={data} />;
}

export function TableSkeleton() {
    return (
        <div className="p-4 space-y-2">
            {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    );
}