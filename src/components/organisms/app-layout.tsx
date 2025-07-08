
'use client';

import { usePathname } from 'next/navigation';
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
  const isPublicPage = !pathname.startsWith('/admin') && pathname !== '/login';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {isPublicPage ? (
        <div className="flex min-h-screen flex-col">
          <Header showAdminLinks={showAdminLinks} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      ) : (
        // For admin and login pages, just render the children.
        // The admin pages will be wrapped by admin/layout.tsx, which provides the AppShell.
        // The login page has no shell.
        <>{children}</>
      )}
      <Toaster />
    </ThemeProvider>
  );
}
