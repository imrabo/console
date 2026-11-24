import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  actions,
  footer,
  className,
}: FormSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>

          {description && <CardDescription>{description}</CardDescription>}
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">{children}</div>

        {footer && <div className="mt-6 border-t pt-4">{footer}</div>}
      </CardContent>
    </Card>
  );
}
