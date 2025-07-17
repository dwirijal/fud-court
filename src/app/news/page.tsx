
import { getPosts } from "@/lib/ghost";
import { NewsTable } from "./news-table";
import Link from "next/link";
import { Newspaper } from "lucide-react";

export default async function NewsPage() {
  const posts = await getPosts({ tag: 'realtime-news' });

  return (
    <div className="container-full section-spacing">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-accent-primary/10 text-accent-primary p-2 rounded-lg">
            <Newspaper className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Berita Fud Court
          </h1>
        </div>
        <p className="text-lg text-text-secondary max-w-2xl mt-2">
          Sumber Anda untuk berita kripto yang tidak bias dan wawasan berbasis data.
        </p>
      </header>

      <NewsTable posts={posts} />
    </div>
  );
}
