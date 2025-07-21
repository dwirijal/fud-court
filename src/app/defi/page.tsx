'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from '@/components/shared/HeroSection';

export default function DefiPage() {
  const defiSections = [
    {
      href: '/defi/protocols',
      title: 'Protocols Overview',
      description: 'Explore Total Value Locked (TVL) and data for various DeFi protocols.',
    },
    {
      href: '/defi/chains',
      title: 'Chains TVL',
      description: 'Compare TVL across different blockchain networks.',
    },
    {
      href: '/defi/yield',
      title: 'Yield Farming',
      description: 'Discover opportunities for yield farming and liquidity provision.',
    },
    {
      href: '/defi/stablecoins',
      title: 'Stablecoin Analytics',
      description: 'Analyze stablecoin market cap, circulation, and historical data.',
    },
    {
      href: '/defi/dexs',
      title: 'DEX Volume Analytics',
      description: 'View trading volume and data for decentralized exchanges.',
    },
    {
      href: '/defi/options',
      title: 'Options DEX Overview',
      description: 'Explore volume and data for decentralized options exchanges.',
    },
  ];

  return (
    <>
      <HeroSection
        title="DeFi Analytics"
        description="Dive deep into decentralized finance data and opportunities."
      />
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defiSections.map((section) => (
            <Link href={section.href} key={section.href}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
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