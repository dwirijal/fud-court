import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Header } from "@/components/organisms/header";
import { Logo } from "@/components/atoms/logo";
import { MainNav } from "@/components/organisms/main-nav";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="hidden md:flex flex-col"
        >
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent className="p-2 flex-1">
            <MainNav />
          </SidebarContent>
          <Separator className="my-2" />
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              <span className="group-data-[state=expanded]:inline-block hidden">Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
