import { Header } from "@/components/organisms/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const showAdminLinks = !!process.env.GHOST_API_URL && !!process.env.GHOST_ADMIN_API_KEY;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header showAdminLinks={showAdminLinks} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
