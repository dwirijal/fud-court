
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPosts } from "@/lib/ghost";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Post } from "@/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const tag = post.primary_tag?.name?.toLowerCase();
  const truncatedTitle = post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title;
  let tagLink: React.ReactNode = null;

  if (tag === 'news') {
    tagLink = <Link href="/news">News</Link>;
  } else if (tag === 'article') {
    tagLink = <Link href="/articles">Articles</Link>;
  } else if (tag === 'learn') {
    tagLink = <Link href="/learn">Learn</Link>;
  }


  return (
    <article className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {tagLink && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  {tagLink}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{truncatedTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="mb-8">
        {post.primary_tag && (
          <Badge variant="secondary" className="mb-4">
            {post.primary_tag.name}
          </Badge>
        )}
        <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight mb-4 leading-tight">
          {post.title}
        </h1>
        {post.primary_tag?.name?.toLowerCase() !== 'news' && (
          <p className="text-muted-foreground text-lg">
            {post.excerpt}
          </p>
        )}
        <time dateTime={post.published_at} className="text-sm text-muted-foreground mt-4 block">
          Published on {format(new Date(post.published_at), "MMMM d, yyyy")}
        </time>
      </header>

      {post.feature_image && (
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.feature_image}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint="crypto abstract"
          />
        </div>
      )}
      
      {post.html && (
        <div
          className="prose prose-invert prose-lg max-w-none 
                     prose-headings:font-headline prose-headings:text-foreground
                     prose-a:text-primary hover:prose-a:text-primary/90
                     prose-strong:text-foreground
                     prose-blockquote:border-primary"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      )}
    </article>
  );
}
