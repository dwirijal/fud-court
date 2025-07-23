'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function ApiSpecsPage() {
  const apiSections = [
    {
      href: '/docs/api-specs/binance-api-spec',
      title: 'Binance API',
      description: 'Spesifikasi untuk data pasar dari Binance.',
    },
    {
      href: '/docs/api-specs/coinGecko-api-spec',
      title: 'CoinGecko API',
      description: 'Spesifikasi untuk data harga dan pasar dari CoinGecko.',
    },
    {
      href: '/docs/api-specs/defillama-api-spec',
      title: 'DefiLlama API',
      description: 'Spesifikasi untuk data TVL dan DeFi dari DefiLlama.',
    },
    {
      href: '/docs/api-specs/dexScreener-api-spec',
      title: 'DexScreener API',
      description: 'Spesifikasi untuk data pasangan DEX real-time dari DexScreener.',
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-2">Spesifikasi API</h1>
      <p className="text-muted-foreground mb-6">Dokumentasi OpenAPI untuk layanan pihak ketiga yang terintegrasi.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiSections.map((section) => (
          <Link href={section.href} key={section.href}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <ArrowRight className="ml-auto h-5 w-5" />
              </CardHeader>
              <CardContent>
                <p className="text-sm">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
