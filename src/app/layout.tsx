
import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/organisms/app-layout';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GlobalNewsTicker } from '@/components/organisms/global-news-ticker';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'Fud Court',
  description: 'Di mana klaim kripto diadili.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable} dark`} suppressHydrationWarning>
      <body className={`font-body antialiased`}>
        <AppLayout>
          {children}
        </AppLayout>
        <GlobalNewsTicker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
