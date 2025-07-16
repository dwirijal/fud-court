
import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/organisms/app-layout';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GlobalNewsTicker } from '@/components/organisms/global-news-ticker';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
});

export const metadata: Metadata = {
  title: 'Fud Court',
  description: 'Clarity in Chaos. Your all-in-one command center for crypto.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fontSans.variable} dark`} suppressHydrationWarning>
      <body className={`font-primary antialiased`}>
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
