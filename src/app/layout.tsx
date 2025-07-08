
import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/organisms/app-layout';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
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
      <body className={`${plusJakartaSans.variable} font-body antialiased`}>
        <AppLayout showAdminLinks={showAdminLinks}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
