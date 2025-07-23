
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScreenShare, Flame, ShieldCheck, HelpCircle, Bot } from 'lucide-react';

const GeckoTerminalIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.89 15.5C16.89 15.5 15.24 15.54 14.99 15.5C14.73 15.45 14.5 15.22 14.5 14.96V12.72C14.5 12.42 14.71 12.18 15 12.18H17.37C17.65 12.18 17.89 12.4 17.89 12.69V15.13C17.89 15.34 17.72 15.5 17.52 15.5H16.89Z"></path>
        <path d="M10.1501 15.5C10.1501 15.5 8.50007 15.54 8.25007 15.5C7.99007 15.45 7.76007 15.22 7.76007 14.96V9.04C7.76007 8.78 7.99007 8.55 8.25007 8.5H10.1501C10.4301 8.5 10.6501 8.72 10.6501 9V14.96C10.6501 15.26 10.4201 15.5 10.1501 15.5Z"></path>
    </svg>
);


export default function ApiSpecsPage() {
  const apiSections = [
    {
      href: 'https://docs.geckoterminal.com/reference/api-reference-overview',
      title: 'GeckoTerminal API',
      description: 'Spesifikasi untuk data DEX real-time dari GeckoTerminal.',
      icon: <GeckoTerminalIcon />,
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
                <div className="p-3 bg-accent/20 rounded-lg text-primary group-hover:bg-accent/30 transition-colors">
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
