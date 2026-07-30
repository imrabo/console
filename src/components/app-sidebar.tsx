'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboardIcon,
  UsersIcon,
  HomeIcon,
  CalendarIcon,
  BookOpenIcon,
  FileTextIcon,
  VideoIcon,
  CreditCardIcon,
  BellIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  Settings2Icon,
  CoinsIcon,
  RssIcon,
  GroupIcon,
  Group,
  Crown,
  Menu,
  LucideLogs,
  LogsIcon,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Separator } from './ui/separator';

const data = {
  user: {
    name: 'Admin',
    email: 'admin@hugged.app',
    avatar: '/avatars/admin.png',
  },

  navMain: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboardIcon },
    { title: 'Users', url: '/users', icon: UsersIcon },
    { title: 'Communities', url: '/communities', icon: Menu },
    { title: 'Meetups', url: '/meetups', icon: CalendarIcon },
    { title: 'Feed', url: '/feed', icon: RssIcon },
    { title: 'Webinars', url: '/webinars', icon: VideoIcon },
    { title: 'Resources', url: '/resources', icon: FileTextIcon },
    { title: 'Moderation', url: '/moderation', icon: LogsIcon },
    { title: 'Team', url: '/admins', icon: Crown },
    { title: 'Settings', url: '/settings', icon: Settings2Icon },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[slot=sidebar-menu-button]:p-1.5">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/hugged-logo-512x512.png"
                  alt="HUGGED"
                  width={40}
                  height={40}
                  priority
                />

                <div className="flex flex-col leading-none">
                  <span className="text-base font-semibold">HUGGED</span>
                  <span className="text-muted-foreground text-xs">Admin Console</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <p className="text-muted-foreground text-xs">
          Built by{' '}
          <a
            href="https://strix.website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary font-medium"
          >
            Strix Engineering Studio
          </a>
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
