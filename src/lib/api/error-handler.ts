
import { ApiError } from './client';

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 400:
        return error.message || 'Invalid request.';

      case 401:
        return 'Your session has expired. Please sign in again.';

      case 403:
        return 'You do not have permission to perform this action.';

      case 404:
        return error.message || 'The requested resource was not found.';

      case 409:
        return error.message || 'This operation conflicts with existing data.';

      case 422:
        return 'Please check the submitted information and try again.';

      case 429:
        return 'Too many requests. Please try again later.';

      case 500:
      case 502:
      case 503:
        return 'A server error occurred. Please try again later.';

      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export function getValidationErrors(
  error: unknown
): Record<string, string[]> | null {
  if (!(error instanceof ApiError) || error.statusCode !== 422) {
    return null;
  }

  const details = error.details;

  if (!details) {
    return null;
  }

  const result: Record<string, string[]> = {};

  for (const [field, value] of Object.entries(details)) {
    if (Array.isArray(value)) {
      result[field] = value.map(String);
    } else if (typeof value === 'string') {
      result[field] = [value];
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}
