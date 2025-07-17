
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, Newspaper, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Beranda', icon: Home, exact: true },
  { href: '/markets', label: 'Pasar', icon: LineChart },
  { href: '/news', label: 'Berita', icon: Newspaper },
  { href: '/articles', label: 'Artikel', icon: BookOpen },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-bg-tertiary bg-bg-secondary/80 backdrop-blur-lg">
      <nav className="grid h-full grid-cols-4">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-accent-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
