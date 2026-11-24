import type { DashboardDateRange } from '../types/dashboard.types';

const DAY = 24 * 60 * 60 * 1000;

export function toDate(value: unknown): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (value && typeof value === 'object') {
    try {
      const convert = (value as { toDate?: unknown }).toDate;
      if (typeof convert === 'function') {
        const converted: unknown = convert.call(value);
        return converted instanceof Date && !Number.isNaN(converted.getTime())
          ? converted
          : null;
      }
    } catch {
      return null;
    }
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const converted = new Date(value);
    return Number.isNaN(converted.getTime()) ? null : converted;
  }
  return null;
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function resolveDashboardRange(
  from?: string,
  to?: string,
  now = new Date()
): DashboardDateRange {
  const end = toDate(to) ?? now;
  const start = toDate(from) ?? new Date(end.getTime() - 29 * DAY);
  const duration = Math.max(DAY, end.getTime() - start.getTime() + DAY);
  const comparisonTo = new Date(start.getTime() - DAY);
  const comparisonFrom = new Date(comparisonTo.getTime() - duration + DAY);

  return {
    from: formatDate(start),
    to: formatDate(end),
    comparisonFrom: formatDate(comparisonFrom),
    comparisonTo: formatDate(comparisonTo),
  };
}

export function percentageChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export function isWithin(value: unknown, from: string, to: string): boolean {
  const date = toDate(value);
  if (!date) return false;
  const day = formatDate(date);
  return day >= from && day <= to;
}
