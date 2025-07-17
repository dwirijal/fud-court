
import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/organisms/app-layout';
import { Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GlobalNewsTicker } from '@/components/organisms/global-news-ticker';

<<<<<<< HEAD
const fontSans = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
  weight: ['400', '500', '600', '700']
=======
const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
});

export const metadata: Metadata = {
  title: 'Fud Court',
<<<<<<< HEAD
  description: 'Di mana klaim kripto diadili.',
  themeColor: '#0A090A',
=======
  description: 'Clarity in Chaos. Your all-in-one command center for crypto.',
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-primary`}>
=======
    <html lang="id" className={`${fontSans.variable} dark`} suppressHydrationWarning>
      <body className={`font-primary antialiased`}>
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
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
