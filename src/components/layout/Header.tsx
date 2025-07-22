'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Bot } from 'lucide-react';

const ListItem = ({ href, title, children }: { href: string; title: string; children: React.ReactNode }) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="block select-none space-y-1 rounded-card p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="text-base font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </NavigationMenuLink>
  </li>
);

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="inline-block font-bold text-lg">FudCourtt</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  href="/"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'text-base',
                    pathname === '/' ? '' : 'text-muted-foreground'
                  )}
                >
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">Market</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <ListItem href="/market/global" title="Global Overview">
                      View global cryptocurrency market data.
                    </ListItem>
                     <ListItem href="/market/fear-greed" title="Fear & Greed Index">
                      Explore market sentiment with the Fear & Greed Index.
                    </ListItem>
                     <ListItem href="/market/exchanges" title="Exchange Overview">
                      Compare trading pairs and exchange information.
                    </ListItem>
                    <ListItem href="/degen" title="Degen">
                      Alat untuk perdagangan spekulatif dan berisiko tinggi.
                    </ListItem>
                    <ListItem href="/defi" title="DeFi">
                      Jelajahi protokol dan peluang keuangan terdesentralisasi.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">Insights</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[500px]">
                    <ListItem href="/economic/news" title="Economic News">
                      Berita ekonomi terbaru yang mempengaruhi pasar global.
                    </ListItem>
                    <ListItem href="/article/learn" title="Learn">
                      Pelajari tentang konsep investasi dan analisis pasar.
                    </ListItem>
                     <ListItem href="/docs" title="Docs">
                      Dokumentasi teknis untuk Fud Courtt.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 justify-center px-4">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full max-w-xs h-9 text-sm bg-muted/50 border-muted-foreground/20 focus-visible:ring-ring focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
