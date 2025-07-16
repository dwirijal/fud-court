
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/ghost";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookOpen } from "lucide-react";
import { ArticleHeroSlider } from "@/components/molecules/article-hero-slider";

export const metadata = {
  title: 'Artikel',
  description: 'Baca analisis mendalam dan konten panjang tentang lanskap kripto.',
};

export default async function ArticlesPage() {
  const articles = await getPosts({ tag: 'article' });
  // Ambil featured post, fallback ke artikel terbaru
  let featuredPosts = await getPosts({ tag: 'featured', limit: 5 });
  if (!featuredPosts || featuredPosts.length === 0) {
    featuredPosts = articles.slice(0, 5);
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Artikel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* HERO SLIDER */}
      <ArticleHeroSlider posts={featuredPosts} />

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight">
                Artikel
            </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
            Analisis mendalam dan konten panjang tentang lanskap kripto.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id} className="flex flex-col overflow-hidden">
              {article.feature_image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.feature_image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <CardHeader className="flex-grow">
                {article.primary_tag && (
                  <Badge variant="secondary" className="mb-2 w-fit">
                    {article.primary_tag.name}
                  </Badge>
                )}
                <CardTitle className="text-xl font-headline leading-tight">
                  <Link href={`/news/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardFooter className="text-sm text-muted-foreground">
                Diterbitkan pada {format(new Date(article.published_at), "d MMMM yyyy")}
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">Tidak ada artikel yang ditemukan.</p>
        )}
      </section>
    </div>
  );
}
