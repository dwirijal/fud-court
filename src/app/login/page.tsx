import { Logo } from "@/components/atoms/logo";
import { LoginForm } from "@/components/organisms/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="flex items-center justify-center gap-3 font-semibold text-foreground">
          <Logo />
          <span>Fud Court</span>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
