import { apiClient } from '@/lib/api/client';
import type {
  CreateUserFormValues,
  EditUserFormValues,
} from '../schemas';
import type {
  UserFilters,
  UserType,
} from '../types';
import { PaginatedResponse } from '@/types';

export const usersService = {
  async fetchUsers(
    filters?: UserFilters
  ): Promise<PaginatedResponse<UserType>> {
    const params = new URLSearchParams();

    Object.entries(filters ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });

    const query = params.toString();

    return apiClient.get<PaginatedResponse<UserType>>(
      `/users${query ? `?${query}` : ''}`
    );
  },

  async fetchUserById(id: string) {
    return apiClient.get<UserType>(`/users/${id}`);
  },

  async createUser(data: CreateUserFormValues) {
    return apiClient.post<UserType>('/users', data);
  },

  async updateUser(id: string, data: Partial<EditUserFormValues>) {
    return apiClient.patch<UserType>(`/users/${id}`, data);
  },

  async deleteUser(id: string) {
    return apiClient.delete<void>(`/users/${id}`);
  },

  async restoreUser(id: string) {
    return apiClient.patch<UserType>(`/users/${id}/restore`, {});
  },

  async updateUserStatus(
    id: string,
    adminDetails: {
      adminId: string;
      adminName: string;
      reason?: string;
    }
  ) {
    return apiClient.patch<UserType>(`/users/${id}`, {
      isActive: !adminDetails.reason ? false : true,
      reason: adminDetails.reason ?? `${adminDetails.adminName} changed status`,
    });
  },

  async updateUserPreferences(
    id: string,
    preferences: UserType['preferences']
  ) {
    return apiClient.patch<UserType>(`/users/${id}/preferences`, {
      preferences,
    });
  },

  async updateUserChildren(id: string, children: UserType['children']) {
    return apiClient.patch<UserType>(`/users/${id}/children`, {
      children,
    });
  },

  async updateCoinBalance(id: string, amount: number, reason: string) {
    return apiClient.patch<UserType>(`/users/${id}/coins`, {
      amount,
      reason,
    });
  },
};

export default usersService;