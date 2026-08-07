import type { CSSProperties } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { CommandMenu } from "@/components/CommandMenu";
import { SiteHeader } from "@/components/site-header";
import { Outlet } from "react-router-dom";
import { Bot } from "lucide-react";
import { Button } from "../ui/button";

// Server Component — no "use client" needed.
// SidebarProvider/AppSidebar/SiteHeader have their own client boundaries.
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
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-6">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
      <CommandMenu />

      {/* Floating AI Button */}
      <Button
        // variant="destructive"
        size="icon"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-none bg-white"
        aria-label="AI Assistant"
      >
        <Bot height={56} width={56} />
      </Button>
    </SidebarProvider>
  );
}
