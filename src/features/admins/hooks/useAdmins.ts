import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { adminUsersService } from '../services/adminUsersService';
import type { AdminUserFormData } from '../schemas';
import { QUERY_KEYS } from '@/lib/constants/QUERY_KEYS';
import type { IAdminUser } from '../types';

export const useAdminUsersQuery = () => {
  return useQuery<IAdminUser[]>({
    queryKey: [QUERY_KEYS.ADMIN_USERS],
    queryFn: adminUsersService.fetchAdminUsers,
  });
};


export const useAdminUserQuery = (id: string) => {
  return useQuery<IAdminUser>({
    queryKey: [QUERY_KEYS.ADMIN_USERS, id],
    queryFn: () => adminUsersService.fetchAdminUser(id),
    enabled: !!id,
  });
};


export const useCreateAdminUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IAdminUser, Error, AdminUserFormData>({
    mutationFn: (data) =>
      adminUsersService.createAdminUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_USERS],
      });

      toast.success('Admin user created successfully.');
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};


export const useUpdateAdminUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IAdminUser,
    Error,
    {
      id: string;
      data: Partial<AdminUserFormData>;
    }
  >({
    mutationFn: ({ id, data }) =>
      adminUsersService.updateAdminUser(id, data),

    onSuccess: (adminUser) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_USERS],
      });

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.ADMIN_USERS,
          adminUser.id,
        ],
      });

      toast.success(
        `${adminUser.fullName} updated successfully.`
      );
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};


export const useDeleteAdminUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) =>
      adminUsersService.deleteAdminUser(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_USERS],
      });

      toast.success('Admin user deleted successfully.');
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};


export const useToggleAdminStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IAdminUser,
    Error,
    {
      id: string;
      isActive: boolean;
    }
  >({
    mutationFn: ({ id, isActive }) =>
      adminUsersService.updateAdminStatus(id, isActive),

    onSuccess: (adminUser) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_USERS],
      });

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.ADMIN_USERS,
          adminUser.id,
        ],
      });

      toast.success(
        `Admin ${adminUser.isActive ? 'activated' : 'deactivated'
        } successfully.`
      );
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
