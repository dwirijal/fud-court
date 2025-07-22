'use client';

import React from 'react';
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
import { useTheme } from 'next-themes';
import { Sun, Moon, Bot, BarChart } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
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
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/market"
                        >
                          <BarChart className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Market Overview
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/market/global" title="Global Overview" />
                    <ListItem href="/market/fear-greed" title="Fear & Greed Index" />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">Crypto</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-3 lg:w-[800px]">
                    <div className="flex flex-col">
                      <ListItem href="/coins" title="Coins Overview" className="font-bold bg-muted/50" />
                      <ListItem href="/coins/trending" title="Trending Coins" />
                      <ListItem href="/coins/search" title="Coin Search" />
                      <ListItem href="/coins/watchlist" title="My Watchlist" />
                      <ListItem href="/coins/compare" title="Compare Coins" />
                    </div>
                    <div className="flex flex-col">
                      <ListItem href="/degen" title="Degen Trading" className="font-bold bg-muted/50" />
                      <ListItem href="/degen/pairs" title="Hot Trading Pairs" />
                      <ListItem href="/degen/trending" title="Trending Pairs" />
                      <ListItem href="/degen/new-listings" title="New Listings" />
                      <ListItem href="/degen/search" title="Degen Search" />
                    </div>
                    <div className="flex flex-col">
                      <ListItem href="/defi" title="DeFi Analytics" className="font-bold bg-muted/50" />
                      <ListItem href="/defi/protocols" title="Protocols" />
                      <ListItem href="/defi/chains" title="Chains" />
                      <ListItem href="/defi/yield" title="Yield Farming" />
                      <ListItem href="/defi/stablecoins" title="Stablecoins" />
                      <ListItem href="/defi/dexs" title="DEXs" />
                      <ListItem href="/defi/options" title="Options" />
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">Insights</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                    <div>
                        <li className="text-sm font-medium text-foreground py-2 px-3">Learn</li>
                        <ListItem href="/economic/news" title="Economic News" />
                        <ListItem href="/article/learn" title="Learning Hub" />
                    </div>
                    <div>
                        <li className="text-sm font-medium text-foreground py-2 px-3">Project</li>
                        <ListItem href="/about" title="About" />
                        <ListItem href="/docs" title="Docs" />
                        <ListItem href="/docs/api-specs/binance-api-spec" title="API Specs" />
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 justify-center px-4">
          <GlobalSearch />
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
