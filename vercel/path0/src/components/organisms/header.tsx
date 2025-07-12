
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
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
const mainNavLinks = [
  { href: "/markets", label: "Pasar" },
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
    ...mainNavLinks, 
    ...readingComponents.map(item => ({ href: item.href, label: item.title }))
];


export function Header() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const isIslandExpanded = isHovered || activeMenu !== "";

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

      {/* Desktop Header: Dynamic Island */}
      <div
        className="hidden md:flex items-center justify-center fixed top-4 left-0 right-0 z-50 pointer-events-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-background/60 border border-border shadow-lg backdrop-blur-md transition-all duration-200 ease-in-out pointer-events-auto",
            isIslandExpanded ? "px-4 py-2 gap-2" : "p-2.5 gap-0"
          )}
        >
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <div
            className={cn(
              "flex items-center transition-all duration-200 ease-in-out",
              isIslandExpanded
                ? "max-w-screen-lg opacity-100"
                : "max-w-0 opacity-0"
            )}
          >
            <NavigationMenu onValueChange={setActiveMenu} >
              <NavigationMenuList>
                {mainNavLinks.map((item) => (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-accent text-sm font-medium",
                            pathname === item.href
                              ? "text-primary"
                              : "text-foreground/70"
                          )}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}

                <NavigationMenuItem value="reading">
                    <NavigationMenuTrigger className="bg-transparent hover:bg-accent text-sm font-medium data-[state=open]:bg-accent/50 text-foreground/70">
                        Bacaan
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-2 p-3">
                            {readingComponents.map((component) => (
                                <ListItem
                                    key={component.title}
                                    href={component.href}
                                    title={component.title}
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
