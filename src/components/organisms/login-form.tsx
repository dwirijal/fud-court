
'use client';

import { useState } from 'react';
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
import { sendMagicLink } from '@/app/login/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    setIsSuccess(false);
    try {
      await sendMagicLink(values, activeTab);
      setIsSuccess(true);
      setSubmittedEmail(values.email);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleReset = () => {
    setIsSuccess(false);
    form.reset();
    setSubmittedEmail('');
  };
  
  if (isSuccess) {
    return (
        <Card className="w-full">
            <CardHeader className="text-center p-5">
                <CardTitle className="text-2xl font-semibold">Periksa Inbox Anda</CardTitle>
                <CardDescription>
                    Kami telah mengirimkan tautan ajaib ke{' '}
                    <span className="font-semibold text-text-primary">{submittedEmail}</span>.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
                <Button onClick={handleReset} className="w-full" variant="outline">
                    Gunakan email lain
                </Button>
            </CardContent>
        </Card>
    );
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'signin' | 'signup');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="signin" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Masuk</TabsTrigger>
            <TabsTrigger value="signup">Daftar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card>
              <CardHeader className="p-5">
                <CardTitle className="text-xl font-semibold">Selamat Datang Kembali</CardTitle>
                <CardDescription>
                  Masukkan email Anda untuk menerima tautan ajaib untuk masuk.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-0">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="anda@contoh.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="p-5">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Mengirim..." : "Kirim Tautan Masuk"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader className="p-5">
                <CardTitle className="text-xl font-semibold">Buat Akun</CardTitle>
                <CardDescription>
                  Masukkan email Anda untuk membuat akun. Tidak perlu kata sandi!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-0">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="anda@contoh.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="p-5">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Mengirim..." : "Kirim Tautan Daftar"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
