'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from '@/components/shared/HeroSection';
import { ArrowRight } from 'lucide-react';

export default function MarketPage() {
  const marketSections = [
    {
      href: '/market/global',
      title: 'Global Overview',
      description: 'View global cryptocurrency market data.',
    },
    {
      href: '/market/crypto',
      title: 'Crypto Market',
      description: 'View crypto market specific data and sentiment.',
    },
  ];

  return (
    <>
      <HeroSection
        title="Market Overview"
        description="Explore various aspects of the cryptocurrency market."
      />
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketSections.map((section) => (
            <Link href={section.href} key={section.href}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>{section.title}</CardTitle>
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
    </>
  );
}
