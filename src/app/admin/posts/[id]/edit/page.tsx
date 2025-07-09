
'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from "next/navigation";
import { PostEditor } from '@/components/post-editor';
import { updatePost } from '@/lib/actions/posts';
import { getPostById } from "@/lib/ghost-admin";
import type { AdminPost } from "@/lib/ghost-admin";
import type { Post } from '@/types/post';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<AdminPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    const fetchPost = async () => {
      setIsLoading(true);
      const fetchedPost = await getPostById(params.id as string);
      if (!fetchedPost) {
        notFound();
      }
      setPost(fetchedPost);
      setIsLoading(false);
    };
    fetchPost();
  }, [params.id]);

  const handleUpdatePost = async (data: Post) => {
    await updatePost(data);
    // Redirect is handled by server action
  };

  const editorInitialData: Partial<Post> | undefined = post ? {
    id: post.id,
    title: post.title,
    slug: post.slug,
    html: post.html || '',
    excerpt: post.excerpt || '',
    featureImage: post.feature_image || '',
    status: post.status,
    updated_at: post.updated_at,
    
    // Pass optional fields to the editor
    feature_image_alt: post.feature_image_alt || '',
    feature_image_caption: post.feature_image_caption || '',
    published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
    visibility: post.visibility,
    tags: post.tags?.map(t => t.name) || [],
    authors: post.authors?.map(a => a.email || a.name) || [],
    meta_title: post.meta_title || '',
    meta_description: post.meta_description || '',
    og_title: post.og_title || '',
    og_description: post.og_description || '',
    og_image: post.og_image || '',
    twitter_title: post.twitter_title || '',
    twitter_description: post.twitter_description || '',
    twitter_image: post.twitter_image || '',
    canonical_url: post.canonical_url || '',
    email_subject: post.email_subject || '',
    send_email_when_published: post.send_email_when_published,
    codeinjection_head: post.codeinjection_head || '',
    codeinjection_foot: post.codeinjection_foot || '',
  } : undefined;

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <Breadcrumb className="mb-8">
            <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                <Link href="/admin">Admin</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                <Link href="/admin/content">News & Content</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
             <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                <Link href="/admin/content/queue">Post Queue</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>Edit Post</BreadcrumbPage>
            </BreadcrumbItem>
            </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Edit Post</CardTitle>
          <CardDescription>
            Make changes to your post and save them to Ghost CMS.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading || !editorInitialData ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : (
                <PostEditor 
                    initial={editorInitialData}
                    onSubmit={handleUpdatePost}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                />
            )}
        </CardContent>
      </Card>
    </div>
  )
}
