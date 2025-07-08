
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { AdminPost } from '@/lib/ghost-admin';
import { updatePost } from './actions';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  html: z.string().min(1, 'Content is required.'),
  id: z.string(),
  updated_at: z.string(),
});

interface EditFormProps {
    post: AdminPost;
}

export function EditForm({ post }: EditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
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

  return (
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
                <Textarea
                  placeholder="Write your post content here. You can use HTML."
                  className="min-h-[300px]"
                  {...field}
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
  );
}
