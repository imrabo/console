'use client';

import type { ReactNode } from 'react';
import { Search, Download, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  onExport?: () => void;
  exportLabel?: string;
  isExporting?: boolean;
  className?: string;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  actions,
  onExport,
  exportLabel = 'Export',
  isExporting = false,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={`flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between ${className ?? ''}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="pr-9 pl-9"
            aria-label={searchPlaceholder}
          />

          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear search"
              className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
              onClick={() => onSearchChange('')}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onExport && (
          <Button type="button" variant="outline" onClick={onExport} disabled={isExporting}>
            <Download className="mr-2 size-4" />
            {isExporting ? 'Exporting...' : exportLabel}
          </Button>
        )}

        {actions}
      </div>
    </div>
  );
}
