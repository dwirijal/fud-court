
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  History,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/logs", label: "Activity Logs", icon: History },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col items-start gap-1 p-2">
        {navItems.map((item) => {
          const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
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
