import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { AppShell } from "@/components/organisms/app-shell";
import { getPosts } from "@/lib/ghost";
import type { Post } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
            Fud Court News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your source for unbiased crypto news and data-driven insights.
          </p>
        </header>

        <Card className="bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50">
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[200px] text-right">Published Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post: Post) => (
                  <TableRow key={post.id} className="border-neutral-800/50">
                    <TableCell className="font-medium">
                      <Link href={`/news/${post.slug}`} className="hover:text-red-500 transition-colors">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {format(new Date(post.published_at), "HH:mm:ss dd MMMM", { locale: idLocale })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </Card>
      </div>
    </AppShell>
  );
}
