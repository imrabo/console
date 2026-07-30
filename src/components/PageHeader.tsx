// Server Component — no "use client"
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  badge?: ReactNode;
  className?: string;
  loading?: boolean;
}

export function PageHeader({
  title,
  description,
  actions,
  badge,
  className,
  loading = false,
}: PageHeaderProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center',
          className
        )}
      >
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center',
        className
      )}
    >
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h1>
          {badge}
        </div>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
