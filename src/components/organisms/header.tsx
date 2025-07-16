
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/atoms/logo";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ProfileMenu } from "@/components/molecules/profile-menu";

const navLinks = [
  { href: "/markets", label: "Pasar" },
  { href: "/news", label: "Berita" },
  { href: "/articles", label: "Artikel" },
  { href: "/learn", label: "Belajar" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="hidden font-bold sm:inline-block">Fud Court</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Profile Menu for Desktop and Mobile */}
          <div className="hidden md:block">
            <ProfileMenu />
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Buka Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs p-0">
                <SheetHeader className="p-6 pb-4 border-b">
                   <Link href="/" className="flex items-center gap-3">
                    <Logo />
                    <SheetTitle className="text-xl font-semibold font-headline tracking-tight text-foreground">
                      Fud Court
                    </SheetTitle>
                  </Link>
                </SheetHeader>
                <div className="flex h-full flex-col p-6">
                  <nav className="grid gap-4 text-lg font-medium">
                    <Link href="/" className={cn("transition-colors hover:text-primary", pathname === "/" ? "text-primary" : "text-muted-foreground")}>
                      Beranda
                    </Link>
                    {navLinks.map((item) => (
                      <Link
                        key={item.href}
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
                  <div className="mt-auto">
                    <ProfileMenu />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
