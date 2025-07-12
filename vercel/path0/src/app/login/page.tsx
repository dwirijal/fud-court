
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/organisms/login-form';
import { Logo } from '@/components/atoms/logo';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/project-sx-test-and-demo.appspot.com/o/images%2F668bf65499a071f02b54d6be%2Fimage.png?alt=media&token=425d50ae-70c8-4775-8163-f09d57a41926"
        alt="Taman kripto futuristik dengan karakter hewan lucu dan pemandangan kota neon di latar belakang"
        fill
        className="object-cover dark:brightness-[0.4]"
        data-ai-hint="futuristic crypto park"
        priority
      />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
         <Link
            href="/"
            aria-label="Kembali ke halaman utama"
            className="absolute left-4 top-4 flex items-center gap-2 rounded-lg bg-black/30 px-3 py-2 text-sm text-background backdrop-blur-sm transition-colors hover:bg-black/50 md:left-8 md:top-8"
        >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
        </Link>
        <div className="w-full max-w-md space-y-6">
            <div className="flex flex-col items-center text-center">
                <Logo />
                <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                    Selamat Datang di Fud Court
                </h1>
                <p className="text-sm text-muted-foreground">
                    Perjalanan Anda menuju kejelasan di dunia kripto dimulai di sini.
                </p>
            </div>
            <LoginForm />
        </div>
      </div>
    </div>
  );
}
