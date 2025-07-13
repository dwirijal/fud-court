'use client'

import { DataTable } from "@/components/ui/data-table";
import { CryptoData } from "@/types";
import { getColumns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketDataTableClient({ data, currency }: { data: CryptoData[], currency: string }) {
  const columns = getColumns(currency);
  return <DataTable columns={columns} data={data} />;
}

