
'use client';

import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/atoms/logo';
import { MainNav } from './main-nav';
import { ProfileMenu } from '../molecules/profile-menu';

interface AppShellProps {
  children: React.ReactNode;
  showAdminLinks?: boolean;
}

export function AppShell({ children, showAdminLinks }: AppShellProps) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all"
          >
            <Logo />
            <span className="hidden text-xl font-semibold font-headline tracking-tight group-data-[state=expanded]:inline">
              Fud Court
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter className="p-2">
          <ProfileMenu showAdminLinks={showAdminLinks} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="absolute right-4 top-4 md:hidden">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
