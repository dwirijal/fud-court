
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  BookOpen,
  GraduationCap,
  Flame,
  CandlestickChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/markets", label: "Markets", icon: CandlestickChart },
  { href: "/degen", label: "Degen", icon: Flame },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/articles", label: "Articles", icon: BookOpen },
  { href: "/learn", label: "Learn", icon: GraduationCap },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col items-start gap-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "group-data-[state=expanded]:w-full group-data-[state=expanded]:justify-start group-data-[state=expanded]:gap-3",
                    "group-data-[state=collapsed]:h-10 group-data-[state=collapsed]:w-10",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="hidden group-data-[state=expanded]:inline-block">
                    {item.label}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="hidden group-data-[state=collapsed]:block">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
