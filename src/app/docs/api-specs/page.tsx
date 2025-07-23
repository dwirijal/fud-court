
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function ApiSpecsPage() {
  const apiSections = [
    {
      href: 'https://docs.geckoterminal.com/reference/api-reference-overview',
      title: 'GeckoTerminal API',
      description: 'Spesifikasi untuk data DEX real-time dari GeckoTerminal.',
      external: true,
    },
    {
      href: 'https://docs.dexscreener.com/',
      title: 'DexScreener API',
      description: 'Spesifikasi alternatif untuk data pasangan DEX dari DexScreener.',
      external: true,
    },
    {
      href: 'https://defillama.com/docs/api',
      title: 'DefiLlama API',
      description: 'Spesifikasi untuk data TVL dan DeFi dari DefiLlama.',
      external: true,
    },
    {
      href: 'https://alternative.me/crypto/api/',
      title: 'Alternative.me API',
      description: 'API untuk Fear & Greed Index dan data sentimen lainnya.',
      external: true,
    },
    {
      href: 'https://docs.rugcheck.xyz/',
      title: 'RugCheck.xyz API',
      description: 'Spesifikasi untuk analisis keamanan token dan deteksi penipuan.',
      external: true,
    },
    {
      href: 'https://www.coingecko.com/en/api/documentation',
      title: 'CoinGecko API',
      description: 'Spesifikasi untuk data harga dan pasar dari CoinGecko.',
      external: true,
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-2">Spesifikasi API</h1>
      <p className="text-muted-foreground mb-6">Dokumentasi OpenAPI untuk layanan pihak ketiga yang terintegrasi.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiSections.map((section) => (
          <Link href={section.href} key={section.href} target={section.external ? '_blank' : '_self'} rel={section.external ? 'noopener noreferrer' : ''}>
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
