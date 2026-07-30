import type { ReactNode, CSSProperties } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

import { CommandMenu } from '@/components/CommandMenu';
import { SiteHeader } from '@/components/site-header';

interface AdminLayoutProps {
  children: ReactNode;
}

// Server Component — no "use client" needed.
// SidebarProvider/AppSidebar/SiteHeader have their own client boundaries.
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '280px',
          '--sidebar-width-icon': '56px',
          '--header-height': '64px',
        } as CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-6">{children}</div>
        </main>
      </SidebarInset>
      <CommandMenu />
    </SidebarProvider>
  );
}
