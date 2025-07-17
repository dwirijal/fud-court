
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

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className={cn(
        "flex min-h-screen flex-col pt-7", // Add padding-top to prevent content from being hidden by the ticker
        isLoginPage ? "pt-0" : "pb-16 md:pb-0" // Remove padding-top for login page
      )}>
        {isLoginPage ? (
          children
        ) : (
          <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileBottomNav />
          </>
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
