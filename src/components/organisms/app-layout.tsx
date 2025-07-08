
'use client';

import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/organisms/app-shell';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children: React.ReactNode;
  showAdminLinks?: boolean;
}

export function AppLayout({ children, showAdminLinks }: AppLayoutProps) {
  const pathname = usePathname();

  let content;

  if (pathname === '/login') {
    // Special case: Login page has no layout chrome
    content = <>{children}</>;
  } else if (pathname.startsWith('/admin/dashboard')) {
    // Dashboard and its potential sub-routes get the sidebar layout
    content = <AppShell showAdminLinks={showAdminLinks}>{children}</AppShell>;
  } else {
    // All other pages get the "dynamic island" header and footer
    content = (
      <div className="flex min-h-screen flex-col">
        <Header showAdminLinks={showAdminLinks} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {content}
      <Toaster />
    </ThemeProvider>
  );
}
