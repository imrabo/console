import { apiClient } from "@/lib/api/client";
import type { CreateUserFormValues, EditUserFormValues } from "../schemas";
import type { UserFilters, UserType } from "../types";
import type { PaginatedResponse } from "@/types";
type BackendUser = { id: number | string; name: string; email: string; phone_number?: string | null; created_at: string; updated_at?: string };
const mapUser = (u: BackendUser): UserType => ({ id: String(u.id), fullName: u.name, email: u.email, phoneNumber: u.phone_number ?? "", membershipType: "FREE" as UserType["membershipType"], isActive: true, isExpert: false, isDeleted: false, gender: "OTHER" as UserType["gender"], dateOfBirth: new Date(0), createdAt: new Date(u.created_at) });
export const usersService = {
  async fetchUsers(filters?: UserFilters): Promise<PaginatedResponse<UserType>> {
    const page = filters?.page ?? 1; const limit = filters?.limit ?? 50;
    const users = await apiClient.get<BackendUser[]>("/users", { skip: (page - 1) * limit, limit });
    const data = users.map(mapUser);
    return { data, total: data.length, page, limit, totalPages: Math.ceil(data.length / limit) };
  },
  async fetchUserById(id: string) { return mapUser(await apiClient.get<BackendUser>(`/users/${id}`)); },
  async createUser(data: CreateUserFormValues) {
    return mapUser(await apiClient.post<BackendUser>("/users", { name: data.fullName, email: data.email, phone_number: `${data.countryCode}${data.phoneNumber}` }));
  },
  async updateUser(id: string, data: Partial<EditUserFormValues>) {
    const patch: Record<string, unknown> = {};
    if (data.fullName !== undefined) patch.name = data.fullName;
    if (data.email !== undefined) patch.email = data.email;
    if (data.phoneNumber !== undefined) patch.phone_number = data.phoneNumber;
    return mapUser(await apiClient.patch<BackendUser>(`/users/${id}`, patch));
  },
  deleteUser(id: string) { return apiClient.delete<void>(`/users/${id}`); },
  async restoreUser(_id: string): Promise<UserType> { throw new Error("User restoration is not supported by the current backend API."); },
};
export default usersService;
