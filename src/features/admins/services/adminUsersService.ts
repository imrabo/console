import { apiClient } from '@/lib/api/client';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

import type {
  AdminUser,
  AdminUserFormData,
} from '../schemas';

const BASE_URL = `/${COLLECTIONS.ADMIN_USERS}`;

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

  updateAdminUser(
    id: string,
    data: Partial<AdminUserFormData>
  ) {
    return apiClient.patch<AdminUser>(
      `${BASE_URL}/${id}`,
      data
    );
  },

  deleteAdminUser(id: string) {
    return apiClient.delete<void>(
      `${BASE_URL}/${id}`
    );
  },

  updateAdminStatus(
    id: string,
    isActive: boolean
  ) {
    return apiClient.patch<AdminUser>(
      `${BASE_URL}/${id}/status`,
      {
        isActive,
      }
    );
  },

  updatePassword(
    id: string,
    password: string
  ) {
    return apiClient.patch<void>(
      `${BASE_URL}/${id}/password`,
      {
        password,
      }
    );
  },
};

export default adminUsersService;