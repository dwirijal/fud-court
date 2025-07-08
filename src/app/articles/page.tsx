import { AppShell } from "@/components/organisms/app-shell";
import { getPosts } from "@/lib/ghost";
import { NewsTable } from "@/app/news/news-table";

export default async function ArticlesPage() {
  const posts = await getPosts({ tag: 'article' });

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
            Articles
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            In-depth analysis and long-form content on the crypto landscape.
          </p>
        </header>

        <NewsTable posts={posts} />
      </div>
    </AppShell>
  );
}
