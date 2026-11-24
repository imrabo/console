import type { ReactNode } from 'react';

interface SectionHeadingProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export function SectionHeading({ icon, title, description }: SectionHeadingProps) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-muted-foreground mt-0.5">{icon}</span>

      <div className="min-w-0 space-y-0.5">
        <h2 className="text-sm leading-5 font-semibold">{title}</h2>

        {description && <p className="text-muted-foreground text-xs leading-4">{description}</p>}
      </div>
    </div>
  );
}
