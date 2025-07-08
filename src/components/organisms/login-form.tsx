'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendMagicLink } from '@/app/login/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setIsSuccess(false);
    try {
      await sendMagicLink(values);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn('space-y-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isSuccess ? 'Check Your Inbox' : 'Access Your Account'}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? `We've sent a secure magic link to ${form.getValues('email')}.`
              : 'Enter your email to sign up or log in. No password needed.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <Button onClick={() => { setIsSuccess(false); form.reset(); }} className="w-full" variant="outline">
              Use a different email
            </Button>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Sending...' : 'Send Magic Link'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs">
        By clicking continue, you agree to our{' '}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
