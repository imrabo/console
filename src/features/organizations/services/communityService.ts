import { apiClient } from '@/lib/api/client';
import type { ICommunity } from '../types';

export const workspacesService = {
  fetchOrganizations: () =>
    apiClient.get<ICommunity[]>('/workspaces'),

  fetchCommunityById: (id: string) =>
    apiClient.get<ICommunity>(`/workspaces/${id}`),

  createCommunity: (
    data: Omit<ICommunity, 'id' | 'createdAt' | 'updatedAt'>
  ) =>
    apiClient.post<ICommunity>('/workspaces', data),

  updateCommunity: (
    id: string,
    data: Partial<ICommunity>
  ) =>
    apiClient.patch<ICommunity>(`/workspaces/${id}`, data),

  deleteCommunity: (id: string) =>
    apiClient.delete(`/workspaces/${id}`),
};