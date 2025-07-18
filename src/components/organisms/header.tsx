
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
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
  
  return (
    <header className="hidden md:flex items-center justify-between fixed top-0 left-0 right-0 z-50 h-16 px-5 border-b border-border/50 bg-background/60 backdrop-blur-lg">
        <Link href="/" className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-semibold tracking-tight text-foreground">
                Fud Court
            </span>
        </Link>
        <NavigationMenu>
            <NavigationMenuList>
                {mainNavLinks.map((item) => (
                    <NavigationMenuItem key={item.label}>
                        <NavigationMenuLink asChild>
                        <Link
                            href={item.href}
                            className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-bg-tertiary font-semibold",
                            pathname.startsWith(item.href)
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

                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-bg-tertiary font-semibold data-[state=open]:bg-bg-tertiary text-text-primary">
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
