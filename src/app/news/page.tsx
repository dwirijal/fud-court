
import { getPosts } from "@/lib/ghost";
import { NewsTable } from "./news-table";
import Link from "next/link";
import { Newspaper } from "lucide-react";

export default async function NewsPage() {
  const posts = await getPosts({ tag: 'realtime-news' });

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-primary/10 text-primary p-3 rounded-3">
            <Newspaper className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              Berita Fud Court
            </h1>
            <p className="text-base text-text-secondary mt-1">
              Sumber Anda untuk berita kripto yang tidak bias dan wawasan berbasis data.
            </p>
          </div>
        </div>
      </header>

      <NewsTable posts={posts} />
    </>
  );
}
