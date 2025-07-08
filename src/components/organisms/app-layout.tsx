
'use client';

import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/organisms/app-shell';

interface AppLayoutProps {
  children: React.ReactNode;
  showAdminLinks?: boolean;
}

export function AppLayout({ children, showAdminLinks }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AppShell showAdminLinks={showAdminLinks}>{children}</AppShell>;
}
