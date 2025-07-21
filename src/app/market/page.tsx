'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from '@/components/shared/HeroSection';
import { ArrowRight } from 'lucide-react'; // Keep this import

export default function MarketPage() {
  const marketSections = [
    {
      href: '/market/global',
      title: 'Global Overview',
      description: 'View global cryptocurrency market data.',
    },
    {
      href: '/market/fear-greed',
      title: 'Fear & Greed Index',
      description: 'Explore market sentiment with the Fear & Greed Index.',
    },
    {
      href: '/market/exchanges',
      title: 'Exchange Overview',
      description: 'Compare trading pairs and exchange information.',
    },
  ];

  return (
    <>
      <HeroSection
        title="Market Overview"
        description="Explore various aspects of the cryptocurrency market."
      />
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketSections.map((section) => (
            <Link href={section.href} key={section.href}>
              <Card className="h-full hover:shadow-lg transition-shadow glassmorphism">
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
