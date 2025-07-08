
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/organisms/login-form';
import { Logo } from '@/components/atoms/logo';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted p-6">
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:left-8 md:top-8"
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
  );
}
