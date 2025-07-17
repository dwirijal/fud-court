
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
import type { Metadata, ResolvingMetadata } from 'next';
import { SanitizedHtml } from "@/components/atoms/sanitized-html";

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Tidak Ditemukan',
      description: 'Halaman yang Anda cari tidak ada.',
    };
  }

  const seoTitle = post.meta_title || post.og_title || post.title;
  const seoDescription = post.meta_description || post.og_description || post.excerpt;
  const seoImage = post.og_image || post.twitter_image || post.feature_image;

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: post.og_title || seoTitle,
      description: post.og_description || seoDescription,
      type: 'article',
      publishedTime: post.published_at,
      url: `/news/${post.slug}`,
      images: seoImage ? [seoImage, ...previousImages] : previousImages,
    },
    twitter: {
        card: 'summary_large_image',
        title: post.twitter_title || seoTitle,
        description: post.twitter_description || seoDescription,
        images: seoImage ? [seoImage] : [],
    },
    alternates: {
      canonical: `/news/${post.slug}`,
    },
  };
}


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
  let tagHref = '/news';

  if (tag === 'news') {
    tagLink = <Link href="/news">Berita</Link>;
    tagHref = '/news';
  } else if (tag === 'article') {
    tagLink = <Link href="/articles">Artikel</Link>;
    tagHref = '/articles';
  } else if (tag === 'learn') {
    tagLink = <Link href="/learn">Belajar</Link>;
    tagHref = '/learn';
  }


  return (
    <article className="container-full section-spacing max-w-4xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {tagLink && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={tagHref} asChild>
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
      <header className="mb-6">
        {post.primary_tag && (
          <Badge variant="secondary" className="mb-4">
            {post.primary_tag.name}
          </Badge>
        )}
        <h1 className="headline-2 mb-4">
          {post.title}
        </h1>
        {post.primary_tag?.name?.toLowerCase() !== 'news' && (
          <p className="body-large text-text-secondary">
            {post.excerpt}
          </p>
        )}
        <time dateTime={post.published_at} className="caption-regular text-text-tertiary mt-4 block">
          Diterbitkan pada {format(new Date(post.published_at), "d MMMM yyyy")}
        </time>
      </header>

      {post.feature_image && (
        <div className="relative aspect-video w-full mb-6 rounded-4 overflow-hidden">
          <Image
            src={post.feature_image}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint="crypto abstract"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
        </div>
      )}
      
      {post.html && (
        <SanitizedHtml
          className="prose prose-invert max-w-none"
          html={post.html}
        />
      )}
    </article>
  );
}
