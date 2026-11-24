import { Badge } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

type BadgeVariant = NonNullable<VariantProps<typeof Badge>['variant']>;

interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: BadgeVariant;
  className?: string;
}

function getStatusVariant(status: string): BadgeVariant {
  const normalized = status
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

  const variants: Record<string, BadgeVariant> = {
    active: 'default',
    approved: 'default',
    captured: 'default',
    completed: 'default',
    success: 'default',
    published: 'default',
    verified: 'default',

    pending: 'secondary',
    processing: 'secondary',
    created: 'secondary',
    authorized: 'secondary',
    draft: 'secondary',
    inactive: 'secondary',
    paused: 'secondary',

    failed: 'destructive',
    rejected: 'destructive',
    cancelled: 'destructive',
    canceled: 'destructive',
    expired: 'destructive',
    blocked: 'destructive',
    suspended: 'destructive',

    refunded: 'outline',
    archived: 'outline',
    unknown: 'outline',
  };

  return variants[normalized] ?? 'outline';
}

export function StatusBadge({ status, label, variant, className }: StatusBadgeProps) {
  const displayLabel =
    label ?? status.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Badge variant={variant ?? getStatusVariant(status)} className={className}>
      {displayLabel || 'Unknown'}
    </Badge>
  );
}
