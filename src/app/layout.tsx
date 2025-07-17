
import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/organisms/app-layout';
import { Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GlobalNewsTicker } from '@/components/organisms/global-news-ticker';

const fontSans = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Fud Court',
  description: 'Di mana klaim kripto diadili.',
  themeColor: '#0A090A',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-primary`}>
        <GlobalNewsTicker />
        <AppLayout>
          {children}
        </AppLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
