"use client";

import { useCallback, useEffect } from "react";

import {
  BarChart3Icon,
  BellIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CalendarIcon,
  CoinsIcon,
  CreditCardIcon,
  CrownIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  MessageSquareIcon,
  RssIcon,
  Settings2Icon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  UsersIcon,
  UsersRoundIcon,
  VideoIcon,
} from "lucide-react";

import { useCommandMenuStore } from "@/hooks/useCommandMenu";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";
import { useNavigate } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboardIcon,
    shortcut: "G H",
  },
  {
    label: "Users",
    href: "/users",
    icon: UsersIcon,
    shortcut: "G U",
  },
  {
    label: "Communities",
    href: "/communities",
    icon: UsersRoundIcon,
    shortcut: "G C",
  },
  {
    label: "Meets",
    href: "/meetups",
    icon: CalendarDaysIcon,
  },
  {
    label: "Feed",
    href: "/feed",
    icon: RssIcon,
  },
  {
    label: "Webinars",
    href: "/webinars",
    icon: VideoIcon,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: LibraryBigIcon,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingBagIcon,
  },
  {
    label: "Moderation",
    href: "/moderation",
    icon: ShieldCheckIcon,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: BellIcon,
  },
  {
    label: "Team",
    href: "/admins",
    icon: CrownIcon,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings2Icon,
  },
];

export function CommandMenu() {
  const router = useNavigate();

  const { open, openMenu, closeMenu } = useCommandMenuStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();

        if (open) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, openMenu, closeMenu]);

  const navigate = useCallback(
    (href: string) => {
      closeMenu();
      router(href);
    },
    [router, closeMenu],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          openMenu();
        } else {
          closeMenu();
        }
      }}
    >
      <Command>
        <CommandInput placeholder="Search pages, actions..." />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <CommandItem
                  key={item.href}
                  value={item.label}
                  onSelect={() => navigate(item.href)}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>

                  {item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => navigate("/users")}>
              <UsersIcon className="size-4" />
              <span>Add New User</span>
            </CommandItem>

            <CommandItem onSelect={() => navigate("/moderation")}>
              <ShieldCheckIcon className="size-4" />
              <span>View Pending Reports</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
