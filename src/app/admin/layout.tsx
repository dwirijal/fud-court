
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutDashboard } from 'lucide-react';

// This is a placeholder for a real authentication check.
// In a real app, you would get this from a context, a session cookie, or an API call.
const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking the user's role.
    // For now, we'll default to the user NOT being an admin.
    // To test the admin view, you could temporarily set this to `true`.
    const checkStatus = async () => {
      // In a real scenario, you'd fetch the user's session and check their roles/labels from Ghost.
      // e.g., const user = await getCurrentUser();
      // setIsAdmin(user?.labels.includes('admin'));
      setIsAdmin(false); 
      setIsLoading(false);
    };

    checkStatus();
  }, []);

  return { isAdmin, isLoading };
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminStatus();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      // If the user is not an admin, redirect them to the home page.
      router.push('/');
    }
  }, [isAdmin, isLoading, router]);

  // While checking the user's role, show a loading skeleton.
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <LayoutDashboard className="h-10 w-10 animate-pulse text-muted-foreground" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    );
  }

  // If the user is an admin, render the admin content.
  if (isAdmin) {
    return <>{children}</>;
  }

  // If the user is not an admin and the redirect is in progress,
  // return null to avoid rendering the admin page content briefly.
  return null;
}
