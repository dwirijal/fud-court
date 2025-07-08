
import { AppShell } from "@/components/organisms/app-shell";
import { getPosts } from "@/lib/ghost";
import { NewsTable } from "@/app/news/news-table";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";

export default async function LearnPage() {
  const posts = await getPosts({ tag: 'learn' });
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Learn" },
  ];

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12 text-center">
          <Breadcrumbs items={breadcrumbItems} className="mb-4 justify-center" />
          <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
            Learn Crypto
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Educational resources to help you understand the world of crypto.
          </p>
        </header>

        <NewsTable posts={posts} />
      </div>
    </AppShell>
  );
}
