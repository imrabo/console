"use client";

import * as React from "react";
import packageJson from "../../package.json";

import { NavMain } from "../components/nav-main";
import { navMainItems } from "./custom/navigation-items";

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

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5"
              asChild
            >
              <Link to="/" className="flex items-center gap-3">
                <image
                  href="/imrabo-logo-512x512.png"
                  width={40}
                  height={40}
                  className="rounded"
                />

                <div className="flex flex-col leading-none">
                  <span className="text-base font-semibold">IMRABO</span>

                  <span className="text-muted-foreground text-xs">
                    Admin Console v{packageJson.version}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>

      <Separator />

      <SidebarFooter>
        <p className="text-muted-foreground text-xs">
          Built by{" "}
          <Link
            to="https://strix.website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary font-medium"
          >
            Strix Engineering Studio
          </Link>
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
