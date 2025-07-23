
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScreenShare, Flame, ShieldCheck, HelpCircle, Bot } from 'lucide-react';
import * as React from "react";

const GeckoTerminalIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 104 105"
      {...props}
    >
      <path
        fill="#7556F6"
        d="M72.754 12.7C68.596 5.28 60.766.63 52.262.486 43.495.338 35.306 5.002 30.997 12.639l-3.39 6.006a23.9 23.9 0 0 1-9.148 9.115l-6.043 3.38A23.9 23.9 0 0 0 .184 51.735l-.01.823A23.9 23.9 0 0 0 12.39 73.675l5.784 3.242a23.9 23.9 0 0 1 9.166 9.166l3.242 5.785A23.9 23.9 0 0 0 51.7 104.083l.91-.01a23.9 23.9 0 0 0 20.53-12.119l3.723-6.572a23.9 23.9 0 0 1 9.167-9.1l5.473-3.047a23.902 23.902 0 0 0 .056-41.73l-6.178-3.463a23.9 23.9 0 0 1-9.166-9.165z"
      ></path>
      <path
        fill="#B7A2FF"
        d="M72.434 35.346c-3.054-.889-6.216-2.154-9.423-3.428-.185-.81-.896-1.818-2.337-3.054-2.094-1.83-6.027-1.782-9.425-.972-3.752-.89-7.46-1.208-11.017-.347-29.091 8.074-13.044 28.628-23.726 48.428 14.822 8.183 13.12 16.178 40.828 16.954 0 0-6.882-20.329 11.412-29.748 14.839-7.638 25.559-21.822 3.685-27.836z"
      ></path>
      <path
        fill="#B7A2FF"
        d="M82.615 51.859c-6.589 4.677-14.09 8.225-24.72 8.225-4.977 0-5.987-5.326-9.277-2.716-1.699 1.348-7.685 4.363-12.438 4.135-4.794-.231-12.448-3.037-14.6-13.25.122 10.281-.19 19.185-5.083 27.733 5.734.77 13.427 15.788 16.462 19.32 8.545 9.947 16.219 9.318 24.686 8.214-1.763-12.402 9.911-35.846 15.974-42.062 2.296-2.353 6.695-6.196 8.996-9.6"
      ></path>
      <path
        fill="#AC94FF"
        d="M50.467 27.877c2.604 1.04 12.115 4.208 16.23 5.452-4.201-6.972-10.568-6.57-16.23-5.453"
      ></path>
      <path
        fill="#fff"
        d="M53.263 40.069c0 4.527-3.643 8.193-8.135 8.193-4.491 0-8.135-3.666-8.135-8.193s3.644-8.19 8.135-8.19c4.492 0 8.135 3.666 8.135 8.19"
      ></path>
      <ellipse
        cx="48.557"
        cy="40.011"
        fill="#000"
        rx="4.774"
        ry="6.683"
      ></ellipse>
      <path fill="#fff" d="m48.557 40.01-5.728-3.82v7.639z"></path>
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
