
'use client';

import Link from 'next/link';
import {
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
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
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
          <ProfileMenu />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="absolute right-4 top-4">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </>
  );
}
