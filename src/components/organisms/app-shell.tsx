
import { Header } from "@/components/organisms/header";
import { Footer } from "@/components/organisms/footer";

interface AppShellProps {
  children: React.ReactNode;
  showAdminLinks?: boolean;
}

export function AppShell({ children, showAdminLinks }: AppShellProps) {  
  return (
    <div className="flex flex-col min-h-screen">
      <Header showAdminLinks={showAdminLinks} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
