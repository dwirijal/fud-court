import { notFound } from "next/navigation";
import Image from "next/image";
import { getPostBySlug } from "@/lib/ghost";
import { AppShell } from "@/components/organisms/app-shell";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Post } from "@/types";

export async function generateStaticParams() {
    // This is not strictly necessary for mock data but good practice for real CMS
    return [];
}

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <AppShell>
      <article className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <header className="mb-8">
          {post.primary_tag && (
            <Badge variant="secondary" className="mb-4">
              {post.primary_tag.name}
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {post.excerpt}
          </p>
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
    </AppShell>
  );
}
