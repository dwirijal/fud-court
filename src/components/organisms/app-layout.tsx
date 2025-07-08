
'use client';

import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/organisms/app-shell';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
