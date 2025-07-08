
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
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
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import {
  Menu,
  ChevronRight,
  User,
  Settings,
  LifeBuoy,
  LogOut,
  PenSquare,
  PlusCircle,
} from "lucide-react";
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
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
];

const readingComponents: { title: string; href: string; description: string }[] = [
    {
      title: "News",
      href: "/news",
      description:
        "Latest updates and breaking stories from the crypto world.",
    },
    {
      title: "Articles",
      href: "/articles",
      description:
        "In-depth analysis and long-form content on the crypto landscape.",
    },
    {
      title: "Learn",
      href: "/learn",
      description: "Educational resources to help you understand the world of crypto.",
    },
];

// For mobile, we flatten the structure into a single list.
const mobileNavLinks = [...mainNavLinks, ...readingComponents.map(item => ({ href: item.href, label: item.title }))];

export function Header({ showAdminLinks }: { showAdminLinks?: boolean }) {
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
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
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
              <div className="mt-auto border-t border-border/50 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    <UserMenu isMobile showAdminLinks={showAdminLinks} />
                  </div>
                  <ThemeToggle />
                </div>
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
            "flex items-center justify-center rounded-full bg-background/60 border border-border shadow-lg backdrop-blur-md transition-all duration-200 ease-in-out pointer-events-auto",
            isIslandExpanded ? "px-4 py-2 gap-4" : "p-2.5 gap-0"
          )}
        >
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <div
            className={cn(
              "flex items-center transition-all duration-200 ease-in-out",
              isIslandExpanded
                ? "max-w-screen-lg opacity-100 gap-4"
                : "max-w-0 opacity-0"
            )}
          >
            <NavigationMenu onValueChange={setActiveMenu}>
              <NavigationMenuList>
                {mainNavLinks.map((item) => (
                    <NavigationMenuItem key={item.label}>
                        <NavigationMenuLink asChild>
                            <Link
                            href={item.href}
                            className={cn(
                                navigationMenuTriggerStyle(),
                                "bg-transparent hover:bg-accent/50 text-sm font-medium",
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
                    <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 text-sm font-medium data-[state=open]:bg-accent/50 text-foreground/70">
                        Reading
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[600px] grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                <Link
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    href="/"
                                >
                                    <Logo />
                                    <div className="mb-2 mt-4 text-lg font-medium">
                                        Fud Court
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                        Where crypto claims are put on trial. Unbiased news and data.
                                    </p>
                                </Link>
                                </NavigationMenuLink>
                            </li>
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

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu showAdminLinks={showAdminLinks} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function UserMenu({
  isMobile = false,
  showAdminLinks = false,
}: {
  isMobile?: boolean;
  showAdminLinks?: boolean;
}) {
  // A more compact menu for the mobile sheet
  if (isMobile) {
    return (
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
          {showAdminLinks && (
            <>
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
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem>
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
        {showAdminLinks && (
          <>
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
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <User className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
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
