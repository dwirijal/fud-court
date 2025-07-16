
import { getPosts } from "@/lib/ghost";
import { NewsTable } from "@/app/news/news-table";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default async function LearnPage() {
  const posts = await getPosts({ tag: 'learn' });

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight">
                Belajar Kripto
            </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
          Sumber daya pendidikan untuk membantu Anda memahami dunia kripto.
        </p>
      </header>

      <NewsTable posts={posts} />
    </div>
  );
}
