
'use client';

import Link from 'next/link';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  BarChart,
  PenSquare,
  PlusCircle,
  User,
} from 'lucide-react';

export function ProfileMenu({ showAdminLinks }: { showAdminLinks?: boolean }) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 w-12 rounded-full group-data-[state=expanded]:h-10 group-data-[state=expanded]:w-full group-data-[state=expanded]:justify-start group-data-[state=expanded]:gap-3 group-data-[state=expanded]:px-3"
        >
          <Avatar className="h-10 w-10 group-data-[state=expanded]:h-8 group-data-[state=expanded]:w-8">
            <AvatarImage
              src="https://placehold.co/100x100.png"
              alt="User Profile"
              data-ai-hint="user avatar"
            />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left group-data-[state=expanded]:inline">
            <p className="text-sm font-medium">Guest</p>
            <p className="text-xs text-muted-foreground">View Profile</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/login">Log In / Sign Up</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className="h-4 w-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Bahasa Indonesia</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {showAdminLinks && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <BarChart className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/ghost" target="_blank">
                <PenSquare className="h-4 w-4" />
                <span>Ghost Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/create-post">
                <PlusCircle className="h-4 w-4" />
                <span>Create Post</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
