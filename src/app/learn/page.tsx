
import { getPosts } from "@/lib/ghost";
import { NewsTable } from "@/app/news/news-table";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default async function LearnPage() {
  const posts = await getPosts({ tag: 'learn' });

  return (
<<<<<<< HEAD
    <div className="container mx-auto px-4 py-3 md:py-4">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
          Belajar Kripto
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
=======
    <div className="container mx-auto px-4 py-7 md:py-8">
      <header className="mb-7">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-semibold font-headline tracking-tight">
                Belajar Kripto
            </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
          Sumber daya pendidikan untuk membantu Anda memahami dunia kripto.
        </p>
      </header>

      <NewsTable posts={posts} />
    </div>
  );
}
