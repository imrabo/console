export type DateLike =
  | Date
  | string
  | number
  | { toDate?: () => Date }
  | { seconds?: number | string; nanoseconds?: number; _seconds?: number | string; _nanoseconds?: number };

export function toDateValue(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (value && typeof value === 'object') {
    if ('toDate' in value && typeof (value as { toDate?: unknown }).toDate === 'function') {
      const date = (value as { toDate: () => Date }).toDate();
      return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
    }

    const timestamp = value as {
      seconds?: unknown;
      nanoseconds?: unknown;
      _seconds?: unknown;
      _nanoseconds?: unknown;
    };
    const seconds = Number(timestamp.seconds ?? timestamp._seconds);

    if (Number.isFinite(seconds)) {
      const nanoseconds = Number(timestamp.nanoseconds ?? timestamp._nanoseconds ?? 0);
      const date = new Date(seconds * 1000 + Math.floor(nanoseconds / 1_000_000));
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function formatDateTimeLocalInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function toDateTimeLocalInput(value: unknown) {
  const date = toDateValue(value);
  return date ? formatDateTimeLocalInput(date) : '';
}
