"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/atoms/logo";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/news", label: "News" },
  { href: "/portfolio", label: "Portfolio" },
];

export function Header() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Mobile Header: Standard sticky bar with a slide-out sheet menu. */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-lg md:hidden">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-bold font-headline text-foreground">
            Fud Court
          </span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex h-full flex-col p-6">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <Logo />
                <span className="text-xl font-bold font-headline text-foreground">
                  Fud Court
                </span>
              </Link>
              <nav className="grid gap-4 text-lg font-medium">
                {navItems.map((item) => (
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
              <div className="mt-auto">
                <UserMenu isMobile />
              </div>
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
            "flex items-center justify-center rounded-full bg-card/60 border border-white/10 shadow-lg backdrop-blur-xl transition-all duration-300 ease-in-out pointer-events-auto",
            isHovered ? "px-4 py-2 gap-4" : "p-2.5 gap-0"
          )}
        >
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <div
            className={cn(
              "flex items-center transition-all duration-300 ease-in-out overflow-hidden",
              isHovered
                ? "max-w-screen-lg opacity-100 gap-4"
                : "max-w-0 opacity-0 gap-0"
            )}
          >
            <nav className="flex items-center gap-5 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-primary whitespace-nowrap",
                    pathname === item.href
                      ? "text-primary"
                      : "text-foreground/70"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <UserMenu />
          </div>
        </div>
      </div>
    </>
  );
}

function UserMenu({ isMobile = false }: { isMobile?: boolean }) {
  // A more compact menu for the mobile sheet
  if (isMobile) {
    return (
      <div className="border-t border-border/50 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="https://placehold.co/100x100.png"
                    alt="@user"
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium text-sm">User</p>
                  <p className="text-xs text-muted-foreground">View Account</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/admin/create-post">Create Post</Link></DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // User menu for the desktop dynamic island
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full h-10 w-10 p-0 hover:bg-white/10"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://placehold.co/100x100.png"
              alt="@user"
              data-ai-hint="user avatar"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href="/admin/create-post">Create Post</Link></DropdownMenuItem>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
