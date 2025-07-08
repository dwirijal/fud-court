
'use client';

import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/organisms/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children: React.ReactNode;
  showAdminLinks?: boolean;
}

export function AppLayout({ children, showAdminLinks }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  const content = isLoginPage ? (
    <>{children}</>
  ) : (
    <AppShell showAdminLinks={showAdminLinks}>{children}</AppShell>
  );

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
