import { apiClient } from '@/lib/api/client';
import { AdminUser, AdminUserFormData } from '../schemas';
import { QUERY_KEYS } from '@/lib/constants/QUERY_KEYS';

const BASE_URL = `/${QUERY_KEYS.ADMIN_USERS}`;

export const adminUsersService = {
  fetchAdminUsers() {
    return apiClient.get<AdminUser[]>(BASE_URL);
  },

  fetchAdminUser(id: string) {
    return apiClient.get<AdminUser>(`${BASE_URL}/${id}`);
  },

  createAdminUser(data: AdminUserFormData) {
    return apiClient.post<AdminUser>(BASE_URL, data);
  },

  updateAdminUser(id: string, data: Partial<AdminUserFormData>) {
    return apiClient.patch<AdminUser>(`${BASE_URL}/${id}`, data);
  },

  deleteAdminUser(id: string) {
    return apiClient.delete<void>(`${BASE_URL}/${id}`);
  },

  updateAdminStatus(id: string, isActive: boolean) {
    return apiClient.patch<AdminUser>(`${BASE_URL}/${id}`, {
      isActive,
    });
  },

  updatePassword(id: string, password: string) {
    return apiClient.patch<AdminUser>(`${BASE_URL}/${id}`, {
      password,
    });
  },
};

export default adminUsersService;
