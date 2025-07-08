import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/organisms/login-form';
import { Logo } from '@/components/atoms/logo';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Link
            href="/"
            className="absolute left-8 top-8 z-10 flex items-center gap-2 rounded-md bg-foreground/30 p-2 text-sm font-medium text-background backdrop-blur-sm transition-colors hover:bg-foreground/50"
        >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
        </Link>
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/project-sx-test-and-demo.appspot.com/o/images%2F668bf65499a071f02b54d6be%2Fimage.png?alt=media&token=425d50ae-70c8-4775-8163-f09d57a41926"
          alt="Futuristic crypto park with cute animal characters"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.8]"
          data-ai-hint="futuristic crypto park"
          priority
        />
      </div>
      <div className="relative flex items-center justify-center p-6 py-12">
        <Link
            href="/"
            className="absolute left-4 top-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:left-8 md:top-8 lg:hidden"
        >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
        </Link>
        <div className="w-full max-w-md space-y-6">
            <div className="flex flex-col items-center text-center">
                <Logo />
                <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                    Welcome to Fud Court
                </h1>
                <p className="text-sm text-muted-foreground">
                    Your journey to clarity in crypto starts here.
                </p>
            </div>
            <LoginForm />
        </div>
      </div>
    </div>
  );
}
