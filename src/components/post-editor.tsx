
'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Post } from "@/types/post"
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

type Props = {
  initial?: Partial<Post>
  onSubmit: (data: Post) => Promise<void>
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export function PostEditor({ initial = {}, onSubmit, isSubmitting, setIsSubmitting }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [post, setPost] = useState<Post>({
    id: initial.id || undefined,
    title: initial.title || '',
    slug: initial.slug || '',
    html: initial.html || '',
    excerpt: initial.excerpt || '',
    featureImage: initial.featureImage || '',
    status: initial.status || 'draft',
    updated_at: initial.updated_at || undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPost(prev => ({ ...prev, [name]: value }))
  }
  
  const handleFormSubmit = async (newStatus: Post['status']) => {
    setIsSubmitting(true);
    const dataToSubmit = { ...post, status: newStatus };
    try {
        await onSubmit(dataToSubmit);
        toast({
            title: 'Success!',
            description: `Post has been ${newStatus === 'published' ? 'published' : 'saved'}.`
        });
        // Redirect is handled by the server action
    } catch (error) {
        console.error(error);
        toast({
            title: `Error ${newStatus === 'published' ? 'publishing' : 'saving'} post`,
            description: error instanceof Error ? error.message : "An unknown error occurred.",
            variant: 'destructive',
        });
        setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={post.title} onChange={handleChange} placeholder="Your post title" disabled={isSubmitting} />
      </div>

      <div>
        <Label htmlFor="slug">Slug (Optional)</Label>
        <Input id="slug" name="slug" value={post.slug} onChange={handleChange} placeholder="your-post-slug" disabled={isSubmitting} />
      </div>

      <div>
        <Label htmlFor="featureImage">Feature Image URL (Optional)</Label>
        <Input id="featureImage" name="featureImage" value={post.featureImage} onChange={handleChange} placeholder="https://example.com/image.png" disabled={isSubmitting} />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt (Optional)</Label>
        <Textarea id="excerpt" name="excerpt" value={post.excerpt} onChange={handleChange} placeholder="A short summary of your post." disabled={isSubmitting} />
      </div>

      <div>
        <Label htmlFor="html">Content (HTML)</Label>
        <Textarea id="html" name="html" value={post.html} onChange={handleChange} rows={15} placeholder="<h1>Your Content Here</h1>" className="font-mono" disabled={isSubmitting} />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
            <Button type="button" variant="default" onClick={() => handleFormSubmit('published')} disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Save & Publish'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => handleFormSubmit('draft')} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </Button>
        </div>
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
        </Button>
      </div>
    </form>
  )
}
