import { apiClient, setAccessToken } from "@/lib/api/client";
import type { IAdminUser } from "@/features/admins";

type BackendAdmin = { id: number | string; name: string; email: string; is_active: boolean; created_at: string; updated_at?: string };
type TokenResponse = { access_token: string; token_type: string };
const mapAdmin = (admin: BackendAdmin): IAdminUser => ({ id: String(admin.id), fullName: admin.name, email: admin.email, isActive: admin.is_active, createdAt: admin.created_at });

export const authService = {
  async login(data: { email: string; password: string }): Promise<IAdminUser> {
    const tokens = await apiClient.post<TokenResponse>("/auth-admin/login", data);
    setAccessToken(tokens.access_token);
    const admin = await apiClient.get<BackendAdmin>("/auth-admin/me");
    return mapAdmin(admin);
  },
  async initialize(): Promise<IAdminUser | null> {
    const token = await apiClient.refreshSession();
    if (!token) return null;
    const admin = await apiClient.get<BackendAdmin>("/auth-admin/me");
    return mapAdmin(admin);
  },
  async logout() {
    try { await apiClient.post<{ message: string }>("/auth-admin/logout", {}); }
    finally { setAccessToken(null); }
  },
  async getCurrentUser() {
    const admin = await apiClient.get<BackendAdmin>("/auth-admin/me");
    return mapAdmin(admin);
  },
};
