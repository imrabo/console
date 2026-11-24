import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className ?? ''}`}
    >
      <div className="min-w-0 space-y-1">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}

        {eyebrow && <p className="text-muted-foreground text-sm">{eyebrow}</p>}

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        {description && <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
