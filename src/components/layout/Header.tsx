'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button'; // Import Button for theme toggle
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; // Import Sun and Moon icons

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/market', label: 'Market' },
    { href: '/coins', label: 'Coins' },
    { href: '/degen', label: 'Degen' },
    { href: '/defi', label: 'DeFi' },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        {/* Left Section: Logo and Navigation */}
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex items-center space-x-2">
            <span className="inline-block font-bold text-lg">FudCourtt</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm font-medium px-3 py-2", // More minimalist padding
                      pathname === item.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Link href={item.href}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex flex-1 justify-center px-4">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full max-w-xs rounded-full h-9 text-sm bg-muted/50 border-muted-foreground/20 focus-visible:ring-ring focus-visible:ring-offset-0"
          />
        </div>

        {/* Right Section: Theme Toggle */}
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
