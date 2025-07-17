
import { getPosts } from "@/lib/ghost";
import { NewsTable } from "@/app/news/news-table";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default async function LearnPage() {
  const posts = await getPosts({ tag: 'learn' });

  return (
    <div className="container-full section-spacing">
      <header className="mb-7">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-accent-primary/10 text-accent-primary p-2 rounded-3">
                <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
                Belajar Kripto
            </h1>
        </div>
        <p className="text-lg text-text-secondary max-w-2xl mt-2">
          Sumber daya pendidikan untuk membantu Anda memahami dunia kripto.
        </p>
      </header>

      <NewsTable posts={posts} />
    </div>
  );
}
