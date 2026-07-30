// Server Component — no "use client"
import type { ElementType } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  /** Trend percentage e.g. 12.5 or -3.2 */
  trend?: number;
  icon?: ElementType;
  loading?: boolean;
  className?: string;
  suffix?: string;
}

export function KpiCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  loading = false,
  className,
  suffix,
}: KpiCardProps) {
  if (loading) {
    return (
      <Card className={cn('border-border/60 shadow-none', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-1.5 h-8 w-32" />
          <Skeleton className="h-3 w-48" />
        </CardContent>
      </Card>
    );
  }

  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;

  const TrendIcon = trendPositive ? TrendingUpIcon : trendNegative ? TrendingDownIcon : MinusIcon;

  const trendColor = trendPositive
    ? 'text-emerald-600 dark:text-emerald-400'
    : trendNegative
      ? 'text-red-600 dark:text-red-400'
      : 'text-muted-foreground';

  return (
    <Card
      className={cn(
        'border-border/60 hover:border-border shadow-none transition-colors',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-5 pb-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{title}</p>
        {Icon && (
          <div className="bg-muted flex h-7 w-7 items-center justify-center rounded-md">
            <Icon className="text-muted-foreground size-3.5" />
          </div>
        )}
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="text-foreground text-2xl font-semibold tracking-tight tabular-nums">
          {value}
          {suffix && (
            <span className="text-muted-foreground ml-0.5 text-sm font-medium">{suffix}</span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          {trend !== undefined && (
            <span
              className={cn('inline-flex items-center gap-0.5 text-xs font-medium', trendColor)}
            >
              <TrendIcon className="size-3" />
              {Math.abs(trend)}%
            </span>
          )}
          {description && <p className="text-muted-foreground text-xs">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
