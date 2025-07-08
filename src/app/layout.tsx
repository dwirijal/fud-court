
import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/organisms/app-layout';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Fud Court',
  description: 'Where crypto claims are put on trial.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showAdminLinks = !!process.env.GHOST_API_URL && !!process.env.GHOST_ADMIN_API_KEY;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <AppLayout showAdminLinks={showAdminLinks}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
