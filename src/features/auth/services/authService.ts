import { apiClient } from '@/lib/api/client';
import { IAdminUser } from '@/features/admins';

interface LoginRequest {
    email: string;
    password: string;
}

interface ForgotPasswordRequest {
    email: string;
}

export const authService = {
    login: (data: LoginRequest) =>
        apiClient.post<IAdminUser>('/auth/login', data),

    logout: () =>
        apiClient.post<void>('/auth/logout', {}),

    getCurrentUser: () =>
        apiClient.get<IAdminUser | null>('/auth/me'),
};