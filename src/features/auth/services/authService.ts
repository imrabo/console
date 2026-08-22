import { apiClient } from '@/lib/api/client';
import type { IAdminUser } from '@/features/admins';

interface LoginRequest {
    username: string;
    password: string;
}


export const authService = {
    login: (data: LoginRequest) =>
        apiClient.post<IAdminUser>('/auth/admin/login', data),

    logout: () =>
        apiClient.post<void>('/auth/admin/logout', {}),

    getCurrentUser: () =>
        apiClient.get<IAdminUser | null>('/auth/admin/me'),
};