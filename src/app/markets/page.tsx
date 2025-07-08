import { AppShell } from "@/components/organisms/app-shell";
import { getTopCoins } from "@/lib/coingecko";
import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export default async function MarketsPage() {
  const cryptoData = await getTopCoins(100);

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
            Crypto Markets
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore real-time cryptocurrency prices, market caps, and trading
            volumes.
          </p>
        </header>

        <div className="w-full overflow-x-auto">
          <Card className="bg-card/60 backdrop-blur-md">
            <DataTable columns={columns} data={cryptoData} />
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
