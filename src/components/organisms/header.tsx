
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/atoms/logo";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, BookOpen, BarChart3 } from "lucide-react";

// Define navigation structure
interface NavLinkType {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const mainNavLinks: NavLinkType[] = [
  { href: "/", label: "Beranda", icon: <Home className="w-5 h-5 mr-1" /> },
];

const marketComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Market Overview",
    href: "/markets/dashboard",
    description: "Ringkasan data pasar kripto secara keseluruhan.",
  },
  {
    title: "Harga & Volume Top Crypto",
    href: "/markets/top-crypto-prices",
    description: "Harga dan volume perdagangan koin kripto teratas.",
  },
  {
    title: "Stablecoin Metrics",
    href: "/markets/stablecoin-metrics",
    description: "Metrik penting terkait stablecoin.",
  },
  {
    title: "On-Chain Macro Indicators",
    href: "/markets/on-chain-macro-indicators",
    description: "Indikator makro dari data on-chain.",
  },
  {
    title: "Technical Indicators",
    href: "/markets/technical-indicators",
    description: "Indikator teknikal untuk analisis harga.",
  },
  {
    title: "DeFi & TVL Metrics",
    href: "/markets/defi-tvl-metrics",
    description: "Metrik terkait keuangan terdesentralisasi (DeFi) dan Total Value Locked (TVL).",
  },
  {
    title: "Macro Global",
    href: "/markets/macro-global",
    description: "Indikator makro ekonomi global yang memengaruhi pasar kripto.",
  },
  {
    title: "Alert / Signal Log",
    href: "/markets/alert-signal-log",
    description: "Log sinyal dan peringatan pasar.",
  },
];

const readingComponents: { title: string; href: string; description: string }[] = [
    {
      title: "Berita",
      href: "/news",
      description:
        "Pembaruan terkini dan berita terhangat dari dunia kripto.",
    },
    {
      title: "Artikel",
      href: "/articles",
      description:
        "Analisis mendalam dan konten panjang tentang lanskap kripto.",
    },
    {
      title: "Belajar",
      href: "/learn",
      description: "Sumber daya pendidikan untuk membantu Anda memahami dunia kripto.",
    },
];

// For mobile, we flatten the structure into a single list and ensure "Home" is present.
const mobileNavLinks = [
    { href: "/", label: "Beranda" },
    ...marketComponents.map(item => ({ href: item.href, label: item.title })),
    ...readingComponents.map(item => ({ href: item.href, label: item.title }))
];

const marketMenu = { label: "Pasar", icon: <BarChart3 className="w-5 h-5 mr-1" /> };
const readingMenu = { label: "Bacaan", icon: <BookOpen className="w-5 h-5 mr-1" /> };

export function Header() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const isIslandExpanded = isHovered || activeMenu !== "";
  const isReadingPage = readingComponents.some(c => pathname.startsWith(c.href));

  return (
    <>
      {/* Mobile Header: Standard sticky bar with a slide-out sheet menu. */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/60 px-4 backdrop-blur-md md:hidden">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-semibold font-headline tracking-tight text-foreground">
            Fud Court
          </span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Buka Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
             <SheetHeader className="p-6 pb-0">
               <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            </SheetHeader>
            <div className="flex h-full flex-col p-6">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <Logo />
                <span className="text-xl font-semibold font-headline tracking-tight text-foreground">
                  Fud Court
                </span>
              </Link>
              <nav className="grid gap-4 text-lg font-medium">
                {mobileNavLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "transition-colors hover:text-primary",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Dynamic Island Lingkaran Sempurna ala Apple */}
      <div
        className="hidden md:flex items-center justify-center fixed top-4 left-0 right-0 z-50 pointer-events-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-background/70 border border-border shadow-xl backdrop-blur-lg transition-all duration-200 pointer-events-auto w-16 h-16 mx-auto p-0",
            isHovered ? "scale-105" : "scale-100"
          )}
        >
          <Link href="/" className="flex-shrink-0 flex items-center justify-center w-full h-full">
            <Logo />
          </Link>
        </div>
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
