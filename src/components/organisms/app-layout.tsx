
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/organisms/header';
import { MobileBottomNav } from '@/components/organisms/mobile-bottom-nav';
import { Footer } from '@/components/organisms/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isHomePage = pathname === '/';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className={cn(
        "flex min-h-screen flex-col",
        isLoginPage ? "" : "md:pt-16 pb-16 md:pb-0" // Adjust padding for navs
      )}>
        {isLoginPage ? (
          children
        ) : (
          <>
            <Header />
            <main className="flex-1">
              {isHomePage ? (
                children
              ) : (
                <div className="container-full section-spacing">
                  {children}
                </div>
              )}
            </main>
            <Footer />
            <MobileBottomNav />
          </>
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
