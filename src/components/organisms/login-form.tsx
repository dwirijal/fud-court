
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
  email: z.string().email('Harap masukkan alamat email yang valid.'),
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
          error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.',
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
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Periksa Kotak Masuk Anda</CardTitle>
                <CardDescription>
                    Kami telah mengirimkan tautan ajaib yang aman ke{' '}
                    <span className="font-semibold text-foreground">{submittedEmail}</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleReset} className="w-full" variant="outline">
                    Gunakan email yang berbeda
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
              <CardHeader>
                <CardTitle>Selamat Datang Kembali</CardTitle>
                <CardDescription>
                  Masukkan email Anda di bawah ini untuk menerima tautan ajaib untuk masuk ke akun Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="anda@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Mengirim..." : "Kirim Tautan Masuk"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Buat Akun</CardTitle>
                <CardDescription>
                  Masukkan email Anda untuk membuat akun. Tidak perlu kata sandi!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="anda@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
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
