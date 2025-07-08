'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import type { AdminPost } from '@/lib/ghost-admin';
import { updatePost } from './actions';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Skeleton } from '@/components/ui/skeleton';


const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  html: z.string().min(1, 'Content is required.'),
  id: z.string(),
  updated_at: z.string(),
});

interface EditFormProps {
    post: AdminPost;
}

// Custom styles for the editor to blend with ShadCN theme
const editorStyles = `
  .ql-toolbar {
    border-radius: var(--radius) var(--radius) 0 0;
    border-color: hsl(var(--input));
    background-color: hsl(var(--card));
  }
  .ql-container {
    border-radius: 0 0 var(--radius) var(--radius);
    border-color: hsl(var(--input));
    background-color: hsl(var(--background));
    min-height: 300px;
    font-size: 1rem;
  }
  .ql-editor {
    color: hsl(var(--foreground));
  }
  .ql-snow .ql-stroke {
    stroke: hsl(var(--foreground) / 0.7);
  }
  .ql-snow .ql-picker-label {
    color: hsl(var(--foreground) / 0.7);
  }
  .ql-snow .ql-fill, .ql-snow .ql-stroke.ql-fill {
      fill: hsl(var(--foreground) / 0.7);
  }
`;


export function EditForm({ post }: EditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Use useMemo to prevent re-creating the dynamic component on every render
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { 
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    )
  }), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: post.id,
      title: post.title || '',
      html: post.html || '',
      updated_at: post.updated_at,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await updatePost(values);
      toast({
        title: 'Success!',
        description: 'Post has been updated.',
      });
      // The redirect will happen in the action, so we don't need to do anything here.
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error updating post',
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  }

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  return (
    <>
      <style>{editorStyles}</style>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Your post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="html"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                    <ReactQuill
                      theme="snow"
                      modules={quillModules}
                      value={field.value}
                      onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </>
  );
}