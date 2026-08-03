import { apiClient } from '@/lib/api/client';

import {

  MemoryCategory,
  MemoryStatus,
  type CreateMemoryDTO,
  type Memory,
  type UpdateMemoryDTO,
} from '../types';

import type {
  MemoryQueryParams,
} from '../schemas';

import type { PaginatedResponse } from '@/types/PaginatedResponse';

export const memorysService = {
  // ============================
  // Memorys
  // ============================

  async fetchMemorys(params?: MemoryQueryParams) {
    return apiClient.getWithQuery<PaginatedResponse<Memory>>(
      '/memorys',
      params
    );
  },

  async fetchMemoryById(id: string) {
    return apiClient.get<Memory>(`/memorys/${id}`);
  },

  async createMemory(data: CreateMemoryDTO) {
    return apiClient.post<Memory>('/memorys', {
      ...data,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  async updateMemory(
    id: string,
    data: UpdateMemoryDTO
  ) {
    return apiClient.patch<Memory>(
      `/memorys/${id}`,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  async deleteMemory(id: string) {
    return apiClient.delete<void>(`/memorys/${id}`);
  },

  async updateMemoryStatus(
    id: string,
    status: MemoryStatus
  ) {
    return apiClient.patch<Memory>(
      `/memorys/${id}/status`,
      { status }
    );
  },

  async toggleMemoryFeatured(
    id: string,
    isFeatured: boolean
  ) {
    return apiClient.patch<Memory>(
      `/memorys/${id}/featured`,
      { isFeatured }
    );
  },

  async toggleMemoryActive(
    id: string,
    isActive: boolean
  ) {
    return apiClient.patch<Memory>(
      `/memorys/${id}/active`,
      { isActive }
    );
  },


  // ============================
  // Analytics
  // ============================

  async getActiveMemorysCount() {
    return apiClient.get<number>(
      '/memorys/analytics/active-count'
    );
  },

  async getFeaturedMemorys() {
    return apiClient.get<Memory[]>(
      '/memorys/featured'
    );
  },

  async getUpcomingMemorys() {
    return apiClient.get<Memory[]>(
      '/memorys/upcoming'
    );
  },

  async getMemorysByCategory(
    category: MemoryCategory
  ) {
    return apiClient.get<Memory[]>(
      `/memorys/category/${category}`
    );
  },

  async validateMemoryForRegistration(
    memoryId: string
  ) {
    return apiClient.get<{
      valid: boolean;
      message?: string;
      memory?: Memory;
    }>(
      `/memorys/${memoryId}/validate-registration`
    );
  },
};

export default memorysService;