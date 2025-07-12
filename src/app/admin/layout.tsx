
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This layout now permanently redirects all /admin traffic to the homepage.
// This effectively deactivates the entire admin section until it's ready for publishing.
export default function DeactivatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  // Return null to prevent any rendering of the admin content while redirecting.
  return null;
}
