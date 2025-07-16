
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/atoms/logo";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { BookOpen, LineChart, Newspaper } from "lucide-react";

// Define navigation structure
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

export function Header() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const isIslandExpanded = isHovered || activeMenu !== "";

  // This header is now only for desktop. Mobile has its own bottom nav.
  return (
    <header className="hidden md:flex items-center justify-center fixed top-4 left-0 right-0 z-50 pointer-events-none">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex items-center justify-center rounded-full bg-bg-glass border border-border backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out pointer-events-auto",
           "shadow-[0_0_20px_hsl(var(--accent-glow)),_0_0_0_1px_hsl(var(--border-color))]",
          isIslandExpanded ? "px-4 py-2 gap-2" : "p-2.5 gap-0"
        )}
      >
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        <div
          className={cn(
            "flex items-center transition-all duration-300 ease-in-out overflow-hidden",
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
                          "bg-transparent hover:bg-accent/50 text-sm font-semibold",
                          pathname === item.href
                            ? "text-accent-primary"
                            : "text-text-primary"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
              ))}

              <NavigationMenuItem value="reading">
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 text-sm font-semibold data-[state=open]:bg-accent/50 text-text-primary">
                      Bacaan
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                      <ul className="grid w-[350px] gap-3 p-4">
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
        </div>
      </div>
    </header>
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
            "flex select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none h-full focus:shadow-md futuristic-card",
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
