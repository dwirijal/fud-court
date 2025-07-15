
import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/organisms/app-layout';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GlobalNewsTicker } from '@/components/organisms/global-news-ticker';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
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
    <html lang="id" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-body antialiased`}>
        <AppLayout>
          {children}
          <GlobalNewsTicker />
        </AppLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
