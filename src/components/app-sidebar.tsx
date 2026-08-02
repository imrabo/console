import * as React from "react";

import {
  LayoutDashboardIcon,
  UsersIcon,
  CalendarIcon,
  FileTextIcon,
  VideoIcon,
  Settings2Icon,
  RssIcon,
  Crown,
  Menu,
  LogsIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";

const data = {
  user: {
    name: "Admin",
    email: "admin@imrabo.app",
    avatar: "/avatars/admin.png",
  },

  navMain: [
    { title: "Dashboard", url: "/", icon: LayoutDashboardIcon },
    { title: "Users", url: "/users", icon: UsersIcon },
    { title: "Communities", url: "/communities", icon: Menu },
    { title: "Meetups", url: "/meetups", icon: CalendarIcon },
    { title: "Feed", url: "/feed", icon: RssIcon },
    { title: "Webinars", url: "/webinars", icon: VideoIcon },
    { title: "Resources", url: "/resources", icon: FileTextIcon },
    { title: "Moderation", url: "/moderation", icon: LogsIcon },
    { title: "Team", url: "/admins", icon: Crown },
    { title: "Settings", url: "/settings", icon: Settings2Icon },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/imrabo-logo-512x512.png"
                  alt="HUGGED"
                  width={40}
                  height={40}
                />

                <div className="flex flex-col leading-none">
                  <span className="text-base font-semibold">HUGGED</span>
                  <span className="text-muted-foreground text-xs">
                    Admin Console
                  </span>
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
          Built by{" "}
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
