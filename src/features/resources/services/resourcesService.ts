import { apiClient } from '@/lib/api/client';

import { ResourceFile, StoreProduct } from '../types';
import {
  Resource,
  CreateResourceInput,
  UpdateResourceInput,
  ResourceStats,
} from '../types/resources.types';

export const resourcesService = {
  /**
   * Fetch all resources
   */
  async fetchResources(filters?: Record<string, string | number | boolean | Date>) {
    return apiClient.getWithQuery<Resource[]>('/resources', filters);
  },

  /**
   * Fetch resource by id
   */
  async fetchResourceById(id: string) {
    return apiClient.get<Resource>(`/resources/${id}`);
  },

  /**
   * Fetch resources by creator
   */
  async fetchResourcesByCreator(creatorId: string) {
    return apiClient.get<Resource[]>(
      `/resources/creator/${creatorId}`
    );
  },

  /**
   * Create resource
   */
  async createResource(data: CreateResourceInput) {
    return apiClient.post<Resource>('/resources', {
      ...data,
      downloads: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Update resource
   */
  async updateResource(
    id: string,
    data: UpdateResourceInput
  ) {
    return apiClient.patch<Resource>(
      `/resources/${id}`,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  /**
   * Delete resource
   */
  async deleteResource(id: string) {
    return apiClient.delete<void>(
      `/resources/${id}`
    );
  },

  /**
   * Increment download count
   */
  async incrementDownloads(id: string) {
    return apiClient.post<Resource>(
      `/resources/${id}/downloads`,
      {}
    );
  },

  /**
   * Resource statistics
   */
  async getResourceStats() {
    return apiClient.get<ResourceStats>(
      '/resources/stats'
    );
  },

  /**
   * Popular resources
   */
  async getPopularResources(limit = 10) {
    return apiClient.getWithQuery<Resource[]>(
      '/resources/popular',
      { limit }
    );
  },

  /**
   * Recent resources
   */
  async getRecentResources(limit = 10) {
    return apiClient.getWithQuery<Resource[]>(
      '/resources/recent',
      { limit }
    );
  },

  /**
   * File resources
   */
  async fetchFileResources() {
    return apiClient.get<ResourceFile[]>(
      '/resources/files'
    );
  },

  /**
   * Products
   */
  async fetchProducts() {
    return apiClient.get<StoreProduct[]>(
      '/products'
    );
  },

  /**
   * Create product
   */
  async createProduct(
    data: Omit<
      StoreProduct,
      'id' | 'createdAt' | 'updatedAt' | 'salesCount'
    >
  ) {
    return apiClient.post<StoreProduct>(
      '/products',
      {
        ...data,
        salesCount: 0,
      }
    );
  },

  /**
   * Update product
   */
  async updateProduct(
    id: string,
    data: Partial<StoreProduct>
  ) {
    return apiClient.patch<StoreProduct>(
      `/products/${id}`,
      data
    );
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    return apiClient.delete<void>(
      `/products/${id}`
    );
  },
};

export default resourcesService;
