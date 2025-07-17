
import { getPosts } from "@/lib/ghost";
import { NewsTable } from "./news-table";
import Link from "next/link";
import { Newspaper } from "lucide-react";

export default async function NewsPage() {
  const posts = await getPosts({ tag: 'realtime-news' });

  return (
<<<<<<< HEAD
    <div className="container mx-auto px-4 py-3 md:py-4">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
          Berita Fud Court
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
=======
    <div className="container mx-auto px-4 py-7 md:py-8">
      <header className="mb-7">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Newspaper className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-semibold font-headline tracking-tight">
            Berita Fud Court
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mt-2">
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
          Sumber Anda untuk berita kripto yang tidak bias dan wawasan berbasis data.
        </p>
      </header>

      <NewsTable posts={posts} />
    </div>
  );
}
