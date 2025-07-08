
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppShell } from '@/components/organisms/app-shell';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createPost } from './actions';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/molecules/breadcrumbs';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
});

export default function CreatePostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await createPost(values);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error creating post',
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Create Post' }
  ];

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-2xl">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Create New Post</CardTitle>
                <CardDescription>
                    Write and publish a new article directly to your Ghost CMS.
                </CardDescription>
            </CardHeader>
            <CardContent>
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
                    name="content"
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
                        {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
