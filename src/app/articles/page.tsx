
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/ghost";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
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
  let featuredPosts = await getPosts({ tag: 'featured', limit: 5 });
  if (!featuredPosts || featuredPosts.length === 0) {
    featuredPosts = articles.slice(0, 5);
  }

  return (
    <>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Artikel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ArticleHeroSlider posts={featuredPosts} />

      <header className="mb-8 mt-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-3 rounded-3">
                <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">
                  Semua Artikel
              </h1>
              <p className="text-base text-text-secondary mt-1">
                  Analisis mendalam dan konten panjang tentang lanskap kripto.
              </p>
            </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id} className="card-news flex flex-col overflow-hidden">
             <Link href={`/news/${article.slug}`} className="block h-full flex flex-col group">
              {article.feature_image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={article.feature_image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-slow group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <CardHeader className="flex-grow p-4">
                {article.primary_tag && (
                  <Badge variant="secondary" className="mb-2 w-fit">
                    {article.primary_tag.name}
                  </Badge>
                )}
                <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                </CardTitle>
                <CardDescription className="text-sm text-text-secondary line-clamp-3 mt-1">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0 mt-auto text-xs font-medium text-text-tertiary">
                Diterbitkan pada {format(new Date(article.published_at), "d MMMM yyyy")}
              </CardFooter>
              </Link>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-base text-text-secondary">Tidak ada artikel yang ditemukan.</p>
        )}
      </section>
    </>
  );
}
