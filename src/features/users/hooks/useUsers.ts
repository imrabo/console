'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import usersService from '../services/usersService';

import { toast } from 'sonner';
import type { CreateUserFormValues, EditUserFormValues } from '../schemas';
import type { UserType } from '../types';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: [COLLECTIONS.USERS],
    queryFn: () => usersService.fetchUsers(),
  });
};

export const useUserQuery = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [COLLECTIONS.USERS, id],
    queryFn: () => usersService.fetchUserById(id),

    initialData: () => {
      const users = queryClient.getQueryData<UserType[]>([
        COLLECTIONS.USERS,
      ]);

      return users?.find((user) => user.id === id);
    },
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserFormValues) => usersService.createUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.USERS] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });

      toast.success('User account created successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to create user account');
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: EditUserFormValues;
    }) => usersService.updateUser(id, data),

    onSuccess: (updated) => {
      // Update detail cache
      queryClient.setQueryData(
        [COLLECTIONS.USERS, updated.data?.id],
        updated.data
      );

      // Update list cache
      queryClient.setQueryData<UserType[]>(
        [COLLECTIONS.USERS],
        (old) =>
          old?.map((user) =>
            user.id === updated.data?.id ? updated.data : user
          ) ?? []
      );

      toast.success(`Updated details for ${updated.data?.fullName}`);
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to update user details');
    },
  });
};

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      adminDetails,
    }: {
      id: string;
      status: UserType['status'];
      adminDetails: { adminId: string; adminName: string; reason?: string };
    }) => usersService.updateUserStatus(id, status, adminDetails),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.USERS] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      toast.success(`User status updated to: ${updated.data?.status}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update user status');
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.USERS] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('User account deleted permanently');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete user account');
    },
  });
};
