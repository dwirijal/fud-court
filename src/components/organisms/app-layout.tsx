
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from './app-shell';

interface AppLayoutProps {
  children: React.ReactNode;
  showAdminLinks?: boolean;
}

export function AppLayout({ children, showAdminLinks }: AppLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {isAdminPage ? (
        <AppShell showAdminLinks={showAdminLinks}>{children}</AppShell>
      ) : isLoginPage ? (
        <>{children}</>
      ) : (
        <div className="flex min-h-screen flex-col">
          <Header showAdminLinks={showAdminLinks} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      )}
      <Toaster />
    </ThemeProvider>
  );
}
