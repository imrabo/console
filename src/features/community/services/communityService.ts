import { apiClient } from '@/lib/api/client';
import { ICommunity } from '../types';

export const communitiesService = {
  fetchCommunities: () =>
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