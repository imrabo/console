'use client';

import { useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

import usersService from '../services/usersService';
import type { CreateUserFormValues, EditUserFormValues } from '../schemas';
import type { UserFilters, UserType } from '../types';
import type { PaginatedResponse } from '@/types';

/**
 * Returns a user-friendly error message without exposing technical details.
 * Handles common HTTP, validation, and network errors.
 */
const getUserFriendlyErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as {
    code?: string;
    status?: number;
    statusCode?: number;
    message?: string;
    response?: {
      status?: number;
      data?: {
        message?: string | string[];
        error?: string;
      };
    };
  } | null;

  if (!err) return fallback;

  const code = err.code?.toLowerCase() ?? '';
  const status = err.status ?? err.statusCode ?? err.response?.status;

  const rawMessage = typeof err.message === 'string' ? err.message : '';

  const message = rawMessage.toLowerCase();

  // Network and connectivity errors.
  if (
    code === 'unavailable' ||
    code === 'auth/network-request-failed' ||
    message.includes('failed to fetch') ||
    message.includes('network request failed') ||
    message.includes('networkerror') ||
    message.includes('fetch failed') ||
    message.includes('internet connection')
  ) {
    return 'Connection problem. Check your internet connection and try again.';
  }

  // Authentication and permissions.
  if (
    code.includes('permission-denied') ||
    code === 'auth/insufficient-permission' ||
    status === 403 ||
    message.includes('permission denied') ||
    message.includes('insufficient permissions')
  ) {
    return "You don't have permission to perform this action.";
  }

  if (code === 'unauthenticated' || code === 'auth/user-token-expired' || status === 401) {
    return 'Your session may have expired. Sign in again and retry.';
  }

  // Missing user records.
  if (
    code === 'not-found' ||
    status === 404 ||
    message.includes('user not found') ||
    message.includes('document does not exist')
  ) {
    return 'This user could not be found. Refresh the list and try again.';
  }

  if (message.includes('email is already registered')) {
    return 'This email address is already registered.';
  }
  if (message.includes('phone number is already registered')) {
    return 'This phone number is already registered.';
  }

  // Duplicate or conflicting records.
  if (
    code === 'already-exists' ||
    code === 'auth/email-already-in-use' ||
    status === 409 ||
    message.includes('already exists') ||
    message.includes('already in use') ||
    message.includes('duplicate')
  ) {
    return 'A user with these details may already exist. Check the information and try again.';
  }

  // Invalid input.
  if (
    code === 'invalid-argument' ||
    code === 'auth/invalid-email' ||
    status === 400 ||
    status === 422
  ) {
    return 'Some information is invalid. Review the fields and try again.';
  }

  // Rate limiting and server errors.
  if (status === 429 || code === 'resource-exhausted') {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (
    (typeof status === 'number' && status >= 500) ||
    code === 'internal' ||
    code === 'deadline-exceeded'
  ) {
    return 'The server could not complete your request. Please try again shortly.';
  }

  // Only surface messages that are safe and useful to the user.
  const responseMessage = err.response?.data?.message;
  const safeMessage =
    typeof responseMessage === 'string'
      ? responseMessage
      : Array.isArray(responseMessage)
        ? responseMessage.find((item) => typeof item === 'string' && item.trim().length > 0)
        : err.response?.data?.error;

  if (
    typeof safeMessage === 'string' &&
    safeMessage.trim() &&
    safeMessage.length <= 180 &&
    !/stack|exception|mongodb|prisma|traceback|internal server error/i.test(
      safeMessage
    )
  ) {
    return safeMessage;
  }

  return fallback;
};

/**
 * Generate unique toast IDs for concurrent operations.
 */
const useToastId = (prefix: string) => {
  const counter = useRef(0);

  return () => `${prefix}-${++counter.current}`;
};

/**
 * Users list.
 */
export const useUsersQuery = (filters: UserFilters) => {
  return useQuery({
    queryKey: [COLLECTIONS.USERS, filters],
    queryFn: () => usersService.fetchUsers(filters),
  });
};

/**
 * Single user.
 * Reuses cached list data as initial detail data when available.
 */
export const useUserQuery = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [COLLECTIONS.USERS, id],
    queryFn: () => usersService.fetchUserById(id),
    enabled: Boolean(id),
    initialData: () => {
      const listQueries = queryClient.getQueriesData<PaginatedResponse<UserType>>({
        queryKey: [COLLECTIONS.USERS],
      });

      return listQueries.flatMap(([, result]) => result?.data ?? []).find((user) => user.id === id);
    },
  });
};

/**
 * Create user.
 */
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  const nextToastId = useToastId('create-user');

  return useMutation({
    mutationFn: (data: CreateUserFormValues) => usersService.createUser(data),

    onMutate: () => {
      const toastId = nextToastId();

      toast.loading('Creating user account…', { id: toastId });

      return { toastId };
    },

    onSuccess: async (_, __, context) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [COLLECTIONS.USERS],
        }),
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'stats'],
        }),
      ]);

      toast.success('User account created successfully.', {
        id: context?.toastId,
      });
    },

    onError: (error, _, context) => {
      toast.error(
        getUserFriendlyErrorMessage(error, 'Unable to create the user account. Please try again.'),
        { id: context?.toastId }
      );
    },
  });
};

/**
 * Update user.
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const nextToastId = useToastId('update-user');

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditUserFormValues }) =>
      usersService.updateUser(id, data),

    onMutate: () => {
      const toastId = nextToastId();

      toast.loading('Saving user changes…', { id: toastId });

      return { toastId };
    },

    onSuccess: async (updated, _, context) => {
      queryClient.setQueryData([COLLECTIONS.USERS, updated.id], updated);

      await queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.USERS],
      });

      toast.success('User details updated successfully.', {
        id: context?.toastId,
      });
    },

    onError: (error, _, context) => {
      toast.error(
        getUserFriendlyErrorMessage(error, 'Unable to save user changes. Please try again.'),
        { id: context?.toastId }
      );
    },
  });
};

/**
 * Restore a deleted user.
 */
export const useRestoreUserMutation = () => {
  const queryClient = useQueryClient();
  const nextToastId = useToastId('restore-user');

  return useMutation({
    mutationFn: (id: string) => usersService.restoreUser(id),

    onMutate: () => {
      const toastId = nextToastId();

      toast.loading('Restoring user account…', { id: toastId });

      return { toastId };
    },

    onSuccess: async (updated, _, context) => {
      queryClient.setQueryData([COLLECTIONS.USERS, updated.id], updated);

      await queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.USERS],
      });

      toast.success('User account restored successfully.', {
        id: context?.toastId,
      });
    },

    onError: (error, _, context) => {
      toast.error(
        getUserFriendlyErrorMessage(error, 'Unable to restore the user account. Please try again.'),
        { id: context?.toastId }
      );
    },
  });
};

/**
 * Delete user.
 */
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const nextToastId = useToastId('delete-user');

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),

    onMutate: () => {
      const toastId = nextToastId();

      toast.loading('Deleting user account…', { id: toastId });

      return { toastId };
    },

    onSuccess: async (_, id, context) => {
      // Remove the detail cache after a successful deletion.
      queryClient.removeQueries({
        queryKey: [COLLECTIONS.USERS, id],
        exact: true,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [COLLECTIONS.USERS],
        }),
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'stats'],
        }),
      ]);

      toast.success('User account deleted successfully.', {
        id: context?.toastId,
      });
    },

    onError: (error, _, context) => {
      toast.error(
        getUserFriendlyErrorMessage(error, 'Unable to delete the user account. Please try again.'),
        { id: context?.toastId }
      );
    },
  });
};
