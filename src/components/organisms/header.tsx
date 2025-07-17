
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
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

// Define navigation structure
const marketComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Daftar Koin",
    href: "/coins",
    description: "Lihat daftar lengkap mata uang kripto.",
  },
  {
    title: "Indikator & Formula Pasar",
    href: "/markets",
    description: "Pahami metrik dan formula pasar yang kompleks.",
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
].filter((v,i,a)=>a.findIndex(t=>(t.href === v.href))===i); // Remove duplicates

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/60 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
          <span className="hidden font-bold sm:inline-block">Fud Court</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Beranda
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Pasar</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {marketComponents.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Bacaan</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {readingComponents.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
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
        </div>
      </div>
    </header>
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
            "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-accent-foreground/80">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
