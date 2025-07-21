'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function DegenPage() {
  const degenSections = [
    {
      href: '/degen/pairs',
      title: 'Hot Trading Pairs',
      description: 'Discover the most active and trending trading pairs.',
    },
    {
      href: '/degen/search',
      title: 'Token & Pair Search',
      description: 'Find any token or trading pair by name, symbol, or address.',
    },
    {
      href: '/degen/trending',
      title: 'Trending Pairs',
      description: 'See what pairs are gaining traction.',
    },
    {
      href: '/degen/new-listings',
      title: 'New Listings',
      description: 'Explore recently listed tokens and pairs.',
    },
    // Add a dummy link for token detail page, as it's dynamic
    {
      href: '/degen/tokens/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Example USDC address
      title: 'Example Token Detail',
      description: 'View details for an example token (USDC on Ethereum).',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Degen Trading</h1>
      <p className="text-muted-foreground mb-6">Tools and data for decentralized and experimental trading.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {degenSections.map((section) => (
          <Link href={section.href} key={section.href}>
            <Card className="h-full hover:shadow-lg transition-shadow glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                <ArrowRight className="ml-auto h-5 w-5" />
              </CardHeader>
              <CardContent>
                <p>{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
