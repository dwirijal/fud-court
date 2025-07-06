import { AppShell } from "@/components/organisms/app-shell";
import { NewsCard } from "@/components/molecules/news-card";
import { getPosts } from "@/lib/ghost";
import type { Post } from "@/types";

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-2">
            Fud Court News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your source for unbiased crypto news and data-driven insights.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
