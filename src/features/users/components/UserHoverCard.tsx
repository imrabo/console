'use client';

import type { UserType } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface UserHoverCardProps {
  user: UserType;
}

export function UserHoverCard({ user }: UserHoverCardProps) {
  const initials =
    user.fullName
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'U';

  const formatDate = (value?: Date | string) => {
    if (!value) return '—';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? '—'
      : date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant="link"
          className="text-foreground h-auto justify-start p-0 text-left font-bold"
          onClick={(event) => event.stopPropagation()}
        >
          {user.fullName || 'Unknown user'}
        </Button>
      </HoverCardTrigger>

      <HoverCardContent side="right" align="start" className="z-[100] w-80 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={user.profileImageUrl || undefined} alt={user.fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="font-semibold">{user.fullName || 'Unknown user'}</p>
            <p className="text-muted-foreground text-sm break-all">{user.email || 'No email'}</p>
            <Badge variant="outline" className="mt-1">
              {user.isDeleted ? 'Deleted' : user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Phone</span>
            <span className="text-right break-all">{user.phoneNumber || '—'}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Membership</span>
            <span>{user.membershipType || '—'}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Gender</span>
            <span>{user.gender || '—'}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Expert</span>
            <span>{user.isExpert ? 'Yes' : 'No'}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Joined</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Last active</span>
            <span>{formatDate(user.lastActiveAt)}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
