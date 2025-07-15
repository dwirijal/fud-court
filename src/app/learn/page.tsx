
import { getPosts } from "@/lib/ghost";
import { NewsTable } from "@/app/news/news-table";
import Link from "next/link";

export default async function LearnPage() {
  const posts = await getPosts({ tag: 'learn' });

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight mb-2">
          Belajar Kripto
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sumber daya pendidikan untuk membantu Anda memahami dunia kripto.
        </p>
      </header>

      <NewsTable posts={posts} />
    </div>
  );
}
