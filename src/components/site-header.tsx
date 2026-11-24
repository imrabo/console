"use client";

import { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchIcon, LogOutIcon, Settings2Icon } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useCommandMenu } from "@/hooks/useCommandMenu";
import { useUserQuery } from "@/features/users/hooks/useUsers";
import { apiClient } from "@/lib/api/client";

interface BreadcrumbRecord extends Record<string, unknown> {
  id?: string;
}

const breadcrumbEntities: Record<
  string,
  { endpoint: string; fields: string[] }
> = {
  communities: {
    endpoint: "communities",
    fields: ["name", "communityName", "title"],
  },
  webinars: { endpoint: "webinars", fields: ["title", "name"] },
  meetups: { endpoint: "meetups", fields: ["title", "name"] },
  resources: { endpoint: "resources", fields: ["title", "name"] },
  feed: { endpoint: "posts", fields: ["title", "content", "text"] },
  orders: {
    endpoint: "orders",
    fields: ["title", "resourceTitle", "orderNumber"],
  },
  payments: {
    endpoint: "payments",
    fields: ["paymentId", "transactionId", "orderId"],
  },
  notifications: { endpoint: "notifications", fields: ["title", "name"] },
  "expert-requests": {
    endpoint: "expert-requests",
    fields: ["userFullName", "fullName", "userName", "email", "title"],
  },
  "webinar-registrations": {
    endpoint: "webinar-registrations",
    fields: ["webinarTitle", "userFullName", "userName", "title"],
  },
  moderation: {
    endpoint: "moderation",
    fields: ["title", "targetName", "userName", "reason"],
  },
};
const staticDetailSegments = new Set([
  "create",
  "edit",
  "new",
  "stats",
  "analytics",
]);

const routeLabels: Record<string, string> = {
  users: "Users",
  communities: "Communities",
  meetups: "Meets",
  feed: "Feed",
  webinars: "Webinars",
  resources: "Resources",
  memberships: "Memberships",
  coins: "Coins",
  notifications: "Notifications",
  moderation: "Moderation",
  analytics: "Analytics",
  settings: "Settings",
};

function useBreadcrumbs() {
  const pathname = useLocation().pathname;
  const segments = pathname.split("/").filter(Boolean);
  const usersIndex = segments.indexOf("users");
  const userId = usersIndex >= 0 ? segments[usersIndex + 1] : undefined;
  const { data: user } = useUserQuery(userId ?? "");
  const entityIndex = segments.findIndex(
    (segment) => segment in breadcrumbEntities,
  );
  const entity = segments[entityIndex];
  const recordId = entityIndex >= 0 ? segments[entityIndex + 1] : undefined;
  const entityConfig = entity ? breadcrumbEntities[entity] : undefined;
  const isRecordRoute = Boolean(
    recordId && !staticDetailSegments.has(recordId),
  );
  const { data: record } = useQuery({
    queryKey: ["breadcrumb-record", entity, recordId],
    queryFn: () =>
      apiClient.get<BreadcrumbRecord>(`/${entityConfig!.endpoint}/${recordId}`),
    enabled: Boolean(entityConfig && isRecordRoute && entity !== "users"),
  });

  const recordLabelValue = entityConfig
    ? entityConfig.fields
        .map((field) => record?.[field])
        .find(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        )
    : undefined;
  const recordLabel =
    recordLabelValue && recordLabelValue.length > 60
      ? `${recordLabelValue.slice(0, 57)}...`
      : recordLabelValue;

  if (segments.length === 0) {
    return [{ label: "Dashboard", href: "/", isCurrent: true }];
  }

  return segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label =
      idx === usersIndex + 1 && user
        ? user.fullName || user.email || seg
        : idx === entityIndex + 1 && entity !== "users"
          ? recordLabel || seg
          : (routeLabels[seg] ??
            seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "));
    return { label, href, isCurrent: idx === segments.length - 1 };
  });
}

function getInitials(name?: string | null) {
  if (!name) return "H";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UserQuickMenu() {
  const { user, logout } = useAuth();
  const pathname = useLocation().pathname;

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (pathname !== "/login") {
            window.location.href = "/login";
          }
        }}
        className="text-destructive hover:text-destructive"
      >
        <LogOutIcon className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-[10px] font-semibold">
            {getInitials(user.fullName)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{user.fullName}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings2Icon className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const breadcrumbs = useBreadcrumbs();
  const { open: openCommandMenu } = useCommandMenu();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4">
        {/* Left — trigger + breadcrumbs */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1 h-8 w-8" />
          <Separator orientation="vertical" className="mx-1 h-8" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <Fragment key={crumb.href}>
                  {idx > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {crumb.isCurrent ? (
                      <BreadcrumbPage className="text-foreground text-sm font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          to={crumb.href}
                          className="text-muted-foreground hover:text-foreground text-sm"
                        >
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Center — search */}
        <Button
          variant="outline"
          onClick={openCommandMenu}
          className="text-muted-foreground hidden h-8 w-52 justify-between gap-2 border-dashed px-3 text-sm font-normal sm:flex lg:w-64"
          id="search-trigger"
          aria-label="Open search (⌘K)"
        >
          <div className="flex items-center gap-2">
            <SearchIcon className="size-3.5 shrink-0" />
            <span>Search...</span>
          </div>
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
            ⌘K
          </kbd>
        </Button>

        {/* Right — actions */}
        <div className="flex items-center gap-1">
          {/* <ThemeToggle /> */}
          {/* <NotificationsButton /> */}
          <UserQuickMenu />
        </div>
      </div>
    </header>
  );
}
