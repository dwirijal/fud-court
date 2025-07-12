
'use client';

import { useState } from 'react';
import { PostEditor } from '@/components/post-editor';
import { createPost } from '@/lib/actions/posts';
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
import type { Post } from '@/types/post';

export default function NewPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This function will be passed to the editor and executed on the client.
  // It calls the server action `createPost`.
  const handleCreatePost = async (data: Post) => {
    await createPost(data);
    // The server action will handle redirection on success.
    // Error handling is inside the PostEditor component.
  };
  
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
                <Link href="/admin/content">Berita & Konten</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>Pos Baru</BreadcrumbPage>
            </BreadcrumbItem>
            </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Buat Pos Baru</CardTitle>
          <CardDescription>
            Isi detail di bawah ini untuk membuat pos baru di CMS Ghost Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <PostEditor 
              onSubmit={handleCreatePost} 
              isSubmitting={isSubmitting} 
              setIsSubmitting={setIsSubmitting}
            />
        </CardContent>
      </Card>
    </div>
  )
}
