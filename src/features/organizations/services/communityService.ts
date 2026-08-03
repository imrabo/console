import { apiClient } from '@/lib/api/client';
import type { ICommunity } from '../types';

export const communitiesService = {
  fetchOrganizations: () =>
    apiClient.get<ICommunity[]>('/communities'),

  fetchCommunityById: (id: string) =>
    apiClient.get<ICommunity>(`/communities/${id}`),

  createCommunity: (
    data: Omit<ICommunity, 'id' | 'createdAt' | 'updatedAt'>
  ) =>
    apiClient.post<ICommunity>('/communities', data),

  updateCommunity: (
    id: string,
    data: Partial<ICommunity>
  ) =>
    apiClient.patch<ICommunity>(`/communities/${id}`, data),

  deleteCommunity: (id: string) =>
    apiClient.delete(`/communities/${id}`),
};