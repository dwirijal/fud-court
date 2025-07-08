
import { AppShell } from '@/components/organisms/app-shell';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This value is also used in the root layout, but we need it here too
  // for the ProfileMenu inside the AppShell.
  const showAdminLinks = !!process.env.GHOST_API_URL && !!process.env.GHOST_ADMIN_API_KEY;

  return (
    <AppShell showAdminLinks={showAdminLinks}>
      {children}
    </AppShell>
  );
}
