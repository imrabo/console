
import {
  QueryClient,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { ApiError } from '@/lib/api/client';
import { getApiErrorMessage } from '@/lib/api/error-handler';



function handleGlobalError(error: unknown) {
  if (error instanceof ApiError) {
    // 4xx responses are expected request errors and are presented to users
    // through the shared toast handler below. Keep console errors for failures
    // that need investigation.
    if (error.statusCode >= 500) {
      console.error('[API Error]', {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
        details: error.details ?? null,
      });
    }
  } else {
    console.error('[Unexpected Application Error]', error);
  }

  toast.error(getApiErrorMessage(error));
}


export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Avoid showing a toast for a background refetch
        // when previously loaded data is still available.
        if (query.state.data !== undefined) {
          return;
        }

        if (query.meta?.errorToast === false) {
          return;
        }

        handleGlobalError(error);
      },
    }),

    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.errorToast === false) {
          return;
        }

        handleGlobalError(error);
      },
    }),

    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof ApiError) {
            if (
              [400, 401, 403, 404, 409, 422].includes(
                error.statusCode
              )
            ) {
              return false;
            }
          }

          return failureCount < 2;
        },

        refetchOnWindowFocus: false,
        staleTime: 30 * 1000,
      },

      mutations: {
        retry: false,
      },
    },
  });
}
