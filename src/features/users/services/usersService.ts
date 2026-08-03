import { apiClient } from '@/lib/api/client';
import type { CreateUserFormValues, EditUserFormValues } from '../schemas';
import type { UserType } from '../types';

export const usersService = {
  async fetchUsers() {
    return apiClient.get<UserType[]>('/users');
  },

  async fetchUserById(id: string) {
    return apiClient.get<UserType>(`/users/${id}`);
  },

  async createUser(data: CreateUserFormValues) {
    return apiClient.post<UserType>('/users', {
      ...data,


    });
  },

  async updateUser(id: string, data: Partial<EditUserFormValues>) {
    return apiClient.patch<UserType>(`/users/${id}`, data);
  },

  async deleteUser(id: string) {
    return apiClient.delete<void>(`/users/${id}`);
  },

  async updateUserStatus(
    id: string,
    status: UserType['status'],
    adminDetails: {
      adminId: string;
      adminName: string;
      reason?: string;
    }
  ) {
    return apiClient.patch<UserType>(`/users/${id}/suspend`, {
      status,
      reason:
        adminDetails.reason ??
        `${adminDetails.adminName} changed status`,
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

  async updateUserChildren(
    id: string,
    children: UserType['children']
  ) {
    return apiClient.patch<UserType>(`/users/${id}/children`, {
      children,
    });
  },

  async updateCoinBalance(
    id: string,
    amount: number,
    reason: string
  ) {
    return apiClient.patch<UserType>(`/users/${id}/coins`, {
      amount,
      reason,
    });
  },
};

export default usersService;