
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/atoms/logo";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpen, LineChart, Newspaper } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { motion } from 'framer-motion';

const mainNavLinks = [
  { href: "/markets", label: "Pasar", icon: LineChart },
];

const readingComponents: { title: string; href: string; description: string, icon: React.ElementType }[] = [
    {
      title: "Berita",
      href: "/news",
      description: "Pembaruan terkini & berita terhangat dari dunia kripto.",
      icon: Newspaper,
    },
    {
      title: "Artikel",
      href: "/articles",
      description: "Analisis mendalam & konten panjang tentang lanskap kripto.",
      icon: BookOpen,
    },
    {
      title: "Belajar",
      href: "/learn",
      description: "Sumber daya pendidikan untuk memahami dunia kripto.",
      icon: BookOpen,
    },
];

const mobileNavLinks = [
    { href: "/", label: "Beranda" },
    ...mainNavLinks.map(item => ({ href: item.href, label: item.label })),
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
      <header className="md:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/50 bg-background/60 px-4 backdrop-blur-lg">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-semibold tracking-tight text-foreground">
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
                <span className="text-xl font-semibold tracking-tight text-foreground">
                  Fud Court
                </span>
              </Link>
              <nav className="grid gap-4 text-lg font-medium">
                {mobileNavLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "transition-colors hover:text-primary",
                      pathname.startsWith(item.href) && item.href !== '/' || pathname === item.href
                        ? "text-primary font-semibold"
                        : "text-text-secondary"
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
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            padding: isIslandExpanded ? '0.5rem' : '0.625rem', // p-2 vs p-2.5
            gap: isIslandExpanded ? '0.5rem' : '0rem', // gap-2 vs gap-0
          }}
          className="flex items-center justify-center rounded-full bg-background/60 border border-border/50 shadow-lg backdrop-blur-md pointer-events-auto"
        >
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <motion.div
            animate={{ width: isIslandExpanded ? 'auto' : 0, opacity: isIslandExpanded ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center overflow-hidden"
          >
            <NavigationMenu onValueChange={setActiveMenu} className="px-2">
              <NavigationMenuList>
                {mainNavLinks.map((item) => (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            pathname.startsWith(item.href)
                              ? "text-primary"
                              : "text-foreground/70"
                          )}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}

                <NavigationMenuItem value="reading">
                    <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), "text-foreground/70")}>
                        Bacaan
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-2 p-3">
                            {readingComponents.map((component) => (
                                <ListItem
                                    key={component.title}
                                    href={component.href}
                                    title={component.title}
                                    icon={component.icon}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { icon: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "flex select-none flex-col justify-end rounded-md bg-gradient-to-b from-bg-tertiary/50 to-bg-tertiary p-4 no-underline outline-none h-full transition-colors duration-normal ease-out-quart focus:shadow-md hover:bg-bg-quaternary",
            className
          )}
          {...props}
        >
          <Icon className="h-6 w-6 text-accent-primary mb-2" />
          <div className="mb-1 mt-auto text-lg font-bold text-text-primary">
            {title}
          </div>
          <p className="text-sm leading-tight text-text-secondary">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
