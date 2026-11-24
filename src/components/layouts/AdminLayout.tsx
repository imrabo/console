import type { ReactNode, CSSProperties } from "react";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/CommandMenu";
import { SiteHeader } from "@/components/site-header";
import { EnvironmentBanner } from "../environment-banner";
import { MobileFloatingNav } from "../custom/mobile-floating-nav";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "280px",
          "--sidebar-width-icon": "56px",
          "--header-height": "64px",
        } as CSSProperties
      }
      className="h-svh overflow-hidden"
    >
      <AppSidebar />

      <SidebarInset className="flex h-svh min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <SiteHeader />
        <EnvironmentBanner />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain">
          <div className="w-full max-w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </SidebarInset>

      {/* Mobile Floating Navigation */}
      <MobileFloatingNav />

      <CommandMenu />
    </SidebarProvider>
  );
}
