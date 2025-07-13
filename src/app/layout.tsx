
import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/organisms/app-layout';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getPosts } from '@/lib/ghost';
import { NewsTicker } from '@/components/molecules/news-ticker';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
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
  // Fetch news here for the global news ticker
  const newsPosts = await getPosts({ tag: 'news', limit: 20 });

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <AppLayout>
          {children}
          <NewsTicker posts={newsPosts} />
        </AppLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
