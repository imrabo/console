// Server Component — no "use client"
import type { ElementType } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusVariant =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'banned'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'draft'
  | 'published'
  | 'archived'
  | 'error'
  | 'warning'
  | 'info'
  | 'free'
  | 'premium'
  | 'super_admin'
  | 'admin'
  | 'moderator'
  | 'parent';

interface StatusConfig {
  label: string;
  className: string;
}

const statusConfig: Record<StatusVariant, StatusConfig> = {
  active: {
    label: 'Active',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground border-border' },
  suspended: {
    label: 'Suspended',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
  },
  banned: {
    label: 'Banned',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  },
  pending: {
    label: 'Pending',
    className:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
  },
  approved: {
    label: 'Approved',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  rejected: {
    label: 'Rejected',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  },
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground border-border' },
  published: {
    label: 'Published',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  archived: { label: 'Archived', className: 'bg-muted text-muted-foreground/70 border-border' },
  error: {
    label: 'Error',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  },
  warning: {
    label: 'Warning',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
  },
  info: {
    label: 'Info',
    className:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
  },
  free: { label: 'Free', className: 'bg-muted text-muted-foreground border-border' },
  premium: {
    label: 'Premium',
    className:
      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800',
  },
  super_admin: {
    label: 'Super Admin',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  },
  admin: {
    label: 'Admin',
    className:
      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800',
  },
  moderator: {
    label: 'Moderator',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
  },
  parent: { label: 'Parent', className: 'bg-muted text-muted-foreground border-border' },
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  className?: string;
  dot?: boolean;
  icon?: ElementType;
}

export function StatusBadge({
  status,
  label,
  className,
  dot = false,
  icon: Icon,
}: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s+/g, '_') as StatusVariant;
  const config = statusConfig[key] ?? statusConfig.inactive;
  const displayLabel = label ?? config.label;

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex h-5 items-center gap-1.5 border px-2 py-0.5 text-[11px] font-semibold',
        config.className,
        className
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />}
      {Icon && <Icon className="size-3" aria-hidden="true" />}
      {displayLabel}
    </Badge>
  );
}

/** Map raw string values to StatusVariant for common cases */
export function mapToStatus(value: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    Active: 'active',
    Inactive: 'inactive',
    Suspended: 'suspended',
    Banned: 'banned',
    Pending: 'pending',
    Approved: 'approved',
    Rejected: 'rejected',
    Draft: 'draft',
    Published: 'published',
    Archived: 'archived',
    Free: 'free',
    Premium: 'premium',
    'Community Member': 'premium',
    'Premium Co-op': 'premium',
    'Super Admin': 'super_admin',
    Admin: 'admin',
    Moderator: 'moderator',
    Parent: 'parent',
  };
  return map[value] ?? 'inactive';
}
