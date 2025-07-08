import { AppShell } from "@/components/organisms/app-shell";
import { getPosts } from "@/lib/ghost";
import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <AppShell>
      <div className="px-4 py-12 md:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
            Fud Court News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your source for unbiased crypto news and data-driven insights.
          </p>
        </header>

        <Card className="bg-card/60 backdrop-blur-md -mx-4 border-x-0 rounded-none">
            <DataTable columns={columns} data={posts} />
        </Card>
      </div>
    </AppShell>
  );
}
