
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, ShieldCheck, HelpCircle, Bot } from 'lucide-react';
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

const DexScreenerIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="#fff"
      fillRule="evenodd"
      viewBox="0 0 252 300"
      {...props}
    >
      <path d="M151.818 106.866c9.177-4.576 20.854-11.312 32.545-20.541 2.465 5.119 2.735 9.586 1.465 13.193-.9 2.542-2.596 4.753-4.826 6.512-2.415 1.901-5.431 3.285-8.765 4.033-6.326 1.425-13.712.593-20.419-3.197m1.591 46.886 12.148 7.017c-24.804 13.902-31.547 39.716-39.557 64.859-8.009-25.143-14.753-50.957-39.556-64.859l12.148-7.017a5.95 5.95 0 0 0 3.84-5.845c-1.113-23.547 5.245-33.96 13.821-40.498 3.076-2.342 6.434-3.518 9.747-3.518s6.671 1.176 9.748 3.518c8.576 6.538 14.934 16.951 13.821 40.498a5.95 5.95 0 0 0 3.84 5.845M126 0c14.042.377 28.119 3.103 40.336 8.406 8.46 3.677 16.354 8.534 23.502 14.342 3.228 2.622 5.886 5.155 8.814 8.071 7.897.273 19.438-8.5 24.796-16.709-9.221 30.23-51.299 65.929-80.43 79.589q-.017-.008-.029-.018c-5.228-3.992-11.108-5.988-16.989-5.988s-11.76 1.996-16.988 5.988c-.009.005-.017.014-.029.018-29.132-13.66-71.209-49.359-80.43-79.589 5.357 8.209 16.898 16.982 24.795 16.709 2.929-2.915 5.587-5.449 8.814-8.071C69.31 16.94 77.204 12.083 85.664 8.406 97.882 3.103 111.959.377 126 0m-25.818 106.866c-9.176-4.576-20.854-11.312-32.544-20.541-2.465 5.119-2.735 9.586-1.466 13.193.901 2.542 2.597 4.753 4.826 6.512 2.416 1.901 5.432 3.285 8.766 4.033 6.326 1.425 13.711.593 20.418-3.197"></path>
      <path d="M197.167 75.016c6.436-6.495 12.107-13.684 16.667-20.099l2.316 4.359c7.456 14.917 11.33 29.774 11.33 46.494l-.016 26.532.14 13.754c.54 33.766 7.846 67.929 24.396 99.193l-34.627-27.922-24.501 39.759-25.74-24.231L126 299.604l-41.132-66.748-25.739 24.231-24.501-39.759L0 245.25c16.55-31.264 23.856-65.427 24.397-99.193l.14-13.754-.016-26.532c0-16.721 3.873-31.578 11.331-46.494l2.315-4.359c4.56 6.415 10.23 13.603 16.667 20.099l-2.01 4.175c-3.905 8.109-5.198 17.176-2.156 25.799 1.961 5.554 5.54 10.317 10.154 13.953 4.48 3.531 9.782 5.911 15.333 7.161 3.616.814 7.3 1.149 10.96 1.035-.854 4.841-1.227 9.862-1.251 14.978L53.2 160.984l25.206 14.129a42 42 0 0 1 5.734 3.869c20.781 18.658 33.275 73.855 41.861 100.816 8.587-26.961 21.08-82.158 41.862-100.816a42 42 0 0 1 5.734-3.869l25.206-14.129-32.665-18.866c-.024-5.116-.397-10.137-1.251-14.978 3.66.114 7.344-.221 10.96-1.035 5.551-1.25 10.854-3.63 15.333-7.161 4.613-3.636 8.193-8.399 10.153-13.953 3.043-8.623 1.749-17.689-2.155-25.799l-2.01-4.175z"></path>
    </svg>
);

const DefiLlamaIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width="32" 
    height="32" 
    fill="currentColor" 
    {...props}
  >
    <path d="M16.31 4.395c-.39.39-.73.81-1.021 1.25-.29.44-.52.91-.68 1.41-.17.5-.25 1.03-.25 1.58v4.24c0 .55-.08 1.08-.25 1.58-.16.5-.39.97-.68 1.41-.29.44-.63.86-1.02 1.25-.4.39-.83.7-1.31.94-.48.24-.99.36-1.52.36s-1.04-.12-1.52-.36c-.48-.24-.91-.55-1.31-.94-.39-.39-.73-.81-1.02-1.25-.29-.44-.52-.91-.68-1.41-.17-.5-.25-1.03-.25-1.58V8.635c0-.55.08-1.08.25-1.58.16-.5.39-.97.68-1.41.29-.44.63-.86 1.02-1.25.4-.39.83-.7 1.31-.94.48-.24.99-.36 1.52-.36s1.04.12 1.52.36c.48.24.91.55 1.31.94zm-5.75 3.33v6.46c0 .19.03.37.09.53.06.16.14.31.25.44.11.13.24.23.39.31.15.08.32.12.49.12s.34-.04.49-.12c.15-.08.28-.18.39-.31.11-.13.19-.28.25-.44.06-.16.09-.34.09-.53V7.725c0-.19-.03-.37-.09-.53-.06-.16-.14-.31-.25-.44-.11-.13-.24-.23-.39-.31-.15-.08-.32-.12-.49-.12s-.34.04-.49-.12c-.15-.08-.28-.18-.39-.31-.11-.13-.19-.28-.25-.44a.92.92 0 0 0-.09-.53zm11.36-5.31C21.16.325 19.3.015 17.5.015s-3.52.42-4.95 1.25l-2.04 1.2c-.32.19-.6.41-.83.66-.23-.25-.51-.47-.83-.66l-2.04-1.2C5.39.435 3.96.015 2.16.015c-1.8 0-3.66.31-4.95 2.41C-4.21 4.875-3.32 12.315 0 16.515c3.32 4.2 8.43 6.31 11.92 6.48 3.49.17 9.9-1.93 12.08-6.48 3.56-7.51 3.8-14.03.08-16.62z"/>
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
      icon: <DexScreenerIcon />,
      external: true,
    },
    {
      href: 'https://defillama.com/docs/api',
      title: 'DefiLlama API',
      description: 'Spesifikasi untuk data TVL dan DeFi dari DefiLlama.',
      icon: <DefiLlamaIcon className="text-primary" />,
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
