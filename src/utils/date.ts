export type DateInput =
  | Date
  | string
  | number
  | {
      toDate?: () => Date;
      toMillis?: () => number;
      seconds?: unknown;
      _seconds?: unknown;
    }
  | null
  | undefined;

export function formatDate(date: DateInput, options?: Intl.DateTimeFormatOptions) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return '—';
  }

  const parts = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).formatToParts(parsedDate);
  const day = parts.find((part) => part.type === 'day')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const year = parts.find((part) => part.type === 'year')?.value;

  return day && month && year
    ? `${day} ${month}, ${year}`
    : parts.map((part) => part.value).join('');
}

export function formatDateTime(date: DateInput) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return '—';
  }

  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(parsedDate);

  return `${formatDate(parsedDate)} ${time}`;
}

export function isToday(date: DateInput) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return false;
  }

  const today = new Date();

  return parsedDate.toDateString() === today.toDateString();
}

function parseDate(date: DateInput): Date | null {
  if (!date) {
    return null;
  }

  let parsedDate: Date;

  if (date instanceof Date) {
    parsedDate = date;
  } else if (typeof date === 'object' && typeof date.toDate === 'function') {
    parsedDate = date.toDate();
  } else if (typeof date === 'object' && typeof date.toMillis === 'function') {
    parsedDate = new Date(date.toMillis());
  } else if (typeof date === 'object' && date.seconds !== undefined) {
    parsedDate = new Date(Number(date.seconds) * 1000);
  } else if (typeof date === 'object' && date._seconds !== undefined) {
    parsedDate = new Date(Number(date._seconds) * 1000);
  } else if (typeof date === 'string' || typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    return null;
  }

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

/* ===============================================================
   DATE FORMATTING
=============================================================== */

