
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { GlobalNewsTicker } from './global-news-ticker';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col">
        {isLoginPage ? (
          children
        ) : (
          <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <GlobalNewsTicker />
          </>
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
