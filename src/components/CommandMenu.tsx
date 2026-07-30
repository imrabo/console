'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3Icon,
  BellIcon,
  BookOpenIcon,
  CalendarIcon,
  CoinsIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  Settings2Icon,
  ShieldCheckIcon,
  UsersIcon,
  VideoIcon,
} from 'lucide-react';

import { useCommandMenuStore } from '@/hooks/useCommandMenu';
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
} from './ui/command';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboardIcon, shortcut: 'G H' },
  { label: 'Users', href: '/users', icon: UsersIcon, shortcut: 'G U' },
  { label: 'Communities', href: '/communities', icon: HomeIcon, shortcut: 'G V' },
  { label: 'Meetups', href: '/meetups', icon: CalendarIcon },
  { label: 'Feed', href: '/feed', icon: MessageSquareIcon },
  { label: 'Resources', href: '/resources', icon: FileTextIcon },
  { label: 'Webinars', href: '/webinars', icon: VideoIcon },
  { label: 'Memberships', href: '/memberships', icon: CreditCardIcon },
  { label: 'Notifications', href: '/notifications', icon: BellIcon },
  { label: 'Moderation', href: '/moderation', icon: ShieldCheckIcon },
  { label: 'Analytics', href: '/analytics', icon: BarChart3Icon },
  { label: 'Settings', href: '/settings', icon: Settings2Icon },
];

export function CommandMenu() {
  const router = useRouter();

  const { open, openMenu, closeMenu } = useCommandMenuStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();

        if (open) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, openMenu, closeMenu]);

  const navigate = useCallback(
    (href: string) => {
      closeMenu();
      router.push(href);
    },
    [router, closeMenu]
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

                  {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => navigate('/users')}>
              <UsersIcon className="size-4" />
              <span>Add New User</span>
            </CommandItem>

            <CommandItem onSelect={() => navigate('/moderation')}>
              <ShieldCheckIcon className="size-4" />
              <span>View Pending Reports</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
