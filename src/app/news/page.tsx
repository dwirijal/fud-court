import { AppShell } from "@/components/organisms/app-shell";
import { getPosts } from "@/lib/ghost";
import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import type { Post } from "@/types";

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
            Fud Court News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your source for unbiased crypto news and data-driven insights.
          </p>
        </header>

        <div className="w-full overflow-x-auto">
          <Card className="bg-card/60 backdrop-blur-md overflow-hidden">
              <DataTable
                columns={columns} 
                data={posts}
                renderRowSubComponent={(row) => (
                  <div className="bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">{row.original.excerpt}</p>
                  </div>
                )}
                getRowCanExpand={() => true}
              />
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
