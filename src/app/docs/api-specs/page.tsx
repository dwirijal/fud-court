
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, ScreenShare, Flame, ShieldCheck, HelpCircle, Bot } from 'lucide-react';

export default function ApiSpecsPage() {
  const apiSections = [
    {
      href: 'https://docs.geckoterminal.com/reference/api-reference-overview',
      title: 'GeckoTerminal API',
      description: 'Spesifikasi untuk data DEX real-time dari GeckoTerminal.',
      icon: <Terminal className="h-8 w-8 text-primary" />,
      external: true,
    },
    {
      href: 'https://docs.dexscreener.com/',
      title: 'DexScreener API',
      description: 'Spesifikasi alternatif untuk data pasangan DEX dari DexScreener.',
      icon: <ScreenShare className="h-8 w-8 text-primary" />,
      external: true,
    },
    {
      href: 'https://defillama.com/docs/api',
      title: 'DefiLlama API',
      description: 'Spesifikasi untuk data TVL dan DeFi dari DefiLlama.',
      icon: <Flame className="h-8 w-8 text-primary" />,
      external: true,
    },
    {
      href: 'https://alternative.me/crypto/api/',
      title: 'Alternative.me API',
      description: 'API untuk Fear & Greed Index dan data sentimen lainnya.',
      icon: <HelpCircle className="h-8 w-8 text-primary" />,
      external: true,
    },
    {
      href: 'https://docs.rugcheck.xyz/',
      title: 'RugCheck.xyz API',
      description: 'Spesifikasi untuk analisis keamanan token dan deteksi penipuan.',
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      external: true,
    },
    {
      href: 'https://www.coingecko.com/en/api/documentation',
      title: 'CoinGecko API',
      description: 'Spesifikasi untuk data harga dan pasar dari CoinGecko.',
      icon: <Bot className="h-8 w-8 text-primary" />,
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
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="p-3 bg-accent/20 rounded-lg text-accent-foreground group-hover:bg-accent/30 transition-colors">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
