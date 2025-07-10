
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from './app-shell';
import { SidebarProvider } from '@/hooks/use-sidebar';

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
        <SidebarProvider>
            <AppShell showAdminLinks={showAdminLinks}>{children}</AppShell>
        </SidebarProvider>
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
