'use client';

import type { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';

export interface EntityHoverCardField<T> {
  label: string;
  value: (entity: T) => ReactNode;
  show?: (entity: T) => boolean;
}

export interface EntityHoverCardProps<T> {
  entity: T;

  title: (entity: T) => string;
  subtitle?: (entity: T) => string | undefined;
  imageUrl?: (entity: T) => string | undefined;
  initials?: (entity: T) => string;
  badge?: (entity: T) =>
    | {
        label: string;
        variant?: 'default' | 'secondary' | 'destructive' | 'outline';
      }
    | undefined;

  fields?: EntityHoverCardField<T>[];

  triggerLabel?: (entity: T) => string;
  trigger?: ReactNode;

  fallback?: ReactNode;
  openDelay?: number;
  closeDelay?: number;
  contentClassName?: string;
}

function getInitials(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function EntityHoverCard<T>({
  entity,
  title,
  subtitle,
  imageUrl,
  initials,
  badge,
  fields = [],
  triggerLabel,
  trigger,
  fallback,
  openDelay = 200,
  closeDelay = 100,
  contentClassName = 'w-80',
}: EntityHoverCardProps<T>) {
  const entityTitle = title(entity);
  const entitySubtitle = subtitle?.(entity);
  const entityImage = imageUrl?.(entity);
  const entityBadge = badge?.(entity);

  const visibleFields = fields.filter((field) => field.show?.(entity) ?? true);

  const triggerContent = trigger ?? (
    <Button variant="link" className="h-auto max-w-full justify-start p-0 text-left font-medium">
      <span className="truncate">{triggerLabel?.(entity) ?? entityTitle}</span>
    </Button>
  );

  return (
    <HoverCard>
      <HoverCardTrigger />

      <HoverCardContent className={`flex flex-col gap-3 ${contentClassName}`}>
        <div className="flex items-start gap-3">
          <Avatar className="size-11 shrink-0">
            {entityImage && <AvatarImage src={entityImage} alt={entityTitle} />}
            <AvatarFallback>{initials?.(entity) ?? getInitials(entityTitle)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold break-words">{entityTitle}</p>

              {entityBadge && (
                <Badge variant={entityBadge.variant ?? 'secondary'}>{entityBadge.label}</Badge>
              )}
            </div>

            {entitySubtitle && (
              <p className="text-muted-foreground text-xs break-words">{entitySubtitle}</p>
            )}
          </div>
        </div>

        {visibleFields.length > 0 && (
          <>
            <Separator />

            <dl className="space-y-2">
              {visibleFields.map((field) => (
                <div
                  key={field.label}
                  className="grid grid-cols-[100px_minmax(0,1fr)] gap-2 text-xs"
                >
                  <dt className="text-muted-foreground">{field.label}</dt>

                  <dd className="min-w-0 font-medium break-words">{field.value(entity) ?? '—'}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {fallback}
      </HoverCardContent>
    </HoverCard>
  );
}
