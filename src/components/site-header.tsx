import { Fragment } from "react";
import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";

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
import { Badge } from "@/components/ui/badge";
import {
  SearchIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  CheckIcon,
  LogOutIcon,
  HelpCircleIcon,
  Settings2Icon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useCommandMenu } from "@/hooks/useCommandMenu";
import { useAuth } from "@/features/auth/hooks/useAuth";

const routeLabels: Record<string, string> = {
  users: "Users",
  communities: "Organizations",
  agents: "Agents",
  feed: "Feed",
  memorys: "Memorys",
  resources: "Resources",
  memberships: "Memberships",
  coins: "Coins",
  notifications: "Notifications",
  moderation: "Moderation",
  analytics: "Analytics",
  settings: "Settings",
};

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Dashboard", href: "/", isCurrent: true }];
  }

  return segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label =
      routeLabels[seg] ??
      seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
    return { label, href, isCurrent: idx === segments.length - 1 };
  });
}

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", label: "Light", Icon: SunIcon },
    { value: "dark", label: "Dark", Icon: MoonIcon },
    { value: "system", label: "System", Icon: MonitorIcon },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-8 w-8"
          aria-label="Toggle theme"
        >
          <SunIcon className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="cursor-pointer gap-2 text-sm"
          >
            <Icon className="text-muted-foreground size-3.5" />
            {label}
            {theme === value && <CheckIcon className="ml-auto size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationsButton() {
  const unread = 3;

  const items = [
    {
      title: "New moderation report",
      desc: "A post was flagged for review",
      time: "2m ago",
      dot: "bg-destructive",
    },
    {
      title: "New user registered",
      desc: "Sarah M. joined the platform",
      time: "15m ago",
      dot: "bg-emerald-500",
    },
    {
      title: "Memory scheduled",
      desc: "Parenting 101 — tomorrow 3pm",
      time: "1h ago",
      dot: "bg-blue-500",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative h-8 w-8"
          id="notifications-trigger"
          aria-label="Open notifications"
        >
          <BellIcon className="size-4" />
          {unread > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between py-2">
          <span className="text-sm font-semibold">Notifications</span>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
            {unread} unread
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((n, i) => (
          <DropdownMenuItem
            key={i}
            className="flex cursor-pointer flex-col items-start gap-0.5 py-2.5"
          >
            <div className="flex w-full items-center gap-2">
              <span
                className={cn("size-1.5 shrink-0 rounded-full", n.dot)}
                aria-hidden="true"
              />
              <span className="flex-1 text-sm font-medium">{n.title}</span>
              <span className="text-muted-foreground shrink-0 text-xs">
                {n.time}
              </span>
            </div>
            <p className="text-muted-foreground pl-3.5 text-xs">{n.desc}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center">
          <Link
            to="/notifications"
            className="text-muted-foreground hover:text-foreground w-full text-center text-xs"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserQuickMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="h-8 gap-2 px-2">
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarFallback className="rounded-md text-[10px] font-semibold">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{user.fullName}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link to="/settings">
            <Settings2Icon className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link to="/help">
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            Help & Support
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
    <header className="bg-background/95 sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-sm transition-[width,height] ease-linear">
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
                      <BreadcrumbLink>
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
          <ThemeToggle />
          <NotificationsButton />
          <UserQuickMenu />
        </div>
      </div>
    </header>
  );
}
