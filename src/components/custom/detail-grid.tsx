import type { ReactNode } from 'react';
import { InfoRow } from './info-row';

export interface DetailGridItem {
  label: string;
  value?: ReactNode;
  key?: string;
}

interface DetailGridProps {
  items: DetailGridItem[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  itemClassName?: string;
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export function DetailGrid({ items, columns = 2, className, itemClassName }: DetailGridProps) {
  return (
    <div className={`grid ${columnClasses[columns]} gap-3 ${className ?? ''}`}>
      {items.map((item, index) => (
        <InfoRow key={item.key ?? `${item.label}-${index}`} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
