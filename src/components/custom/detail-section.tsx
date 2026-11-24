import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DetailSectionProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DetailSection({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: DetailSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col items-start justify-between gap-3 space-y-0 sm:flex-row sm:gap-4">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>

        {actions && <div className="flex max-w-full flex-wrap items-center gap-2">{actions}</div>}
      </CardHeader>

      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
