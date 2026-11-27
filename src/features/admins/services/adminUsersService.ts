import { apiClient } from "@/lib/api/client";
import type { AdminUser, AdminUserFormData } from "../schemas";
type BackendAdmin = { id: number | string; name: string; email: string; is_active: boolean; created_at: string; updated_at?: string };
const map = (x: BackendAdmin): AdminUser => ({ id: String(x.id), fullName: x.name, email: x.email, isActive: x.is_active, createdAt: x.created_at });
const payload = (x: Partial<AdminUserFormData>) => ({ ...(x.fullName !== undefined ? { name: x.fullName } : {}), ...(x.email !== undefined ? { email: x.email } : {}), ...(x.password ? { password: x.password } : {}) });
const BASE_URL = "/admin-users";
export const adminUsersService = {
  async fetchAdminUsers() { return (await apiClient.get<BackendAdmin[]>(BASE_URL)).map(map); },
  async fetchAdminUser(id: string) { return map(await apiClient.get<BackendAdmin>(`${BASE_URL}/${id}`)); },
  async createAdminUser(data: AdminUserFormData) { return map(await apiClient.post<BackendAdmin>(BASE_URL, { ...payload(data), is_active: true })); },
  async updateAdminUser(id: string, data: Partial<AdminUserFormData>) { return map(await apiClient.patch<BackendAdmin>(`${BASE_URL}/${id}`, payload(data))); },
  deleteAdminUser(id: string) { return apiClient.delete<void>(`${BASE_URL}/${id}`); },
  async updateAdminStatus(id: string, isActive: boolean) { return map(await apiClient.patch<BackendAdmin>(`${BASE_URL}/${id}`, { is_active: isActive })); },
  async updatePassword(id: string, password: string) { return map(await apiClient.patch<BackendAdmin>(`${BASE_URL}/${id}`, { password })); },
};
export default adminUsersService;
