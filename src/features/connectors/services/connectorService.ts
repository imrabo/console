import { apiClient } from '@/lib/api/client';

import type { ConnectorFile, StoreProduct } from '../types';
import type { Connector, ConnectorStats, CreateConnectorInput, UpdateConnectorInput } from '../types/connector.types';


export const resourcesService = {
  /**
   * Fetch all connectors
   */
  async fetchConnectors(filters?: Record<string, string | number | boolean | Date>) {
    return apiClient.getWithQuery<Connector[]>('/connectors', filters);
  },

  /**
   * Fetch connector by id
   */
  async fetchConnectorById(id: string) {
    return apiClient.get<Connector>(`/connectors/${id}`);
  },

  /**
   * Fetch connectors by creator
   */
  async fetchConnectorsByCreator(creatorId: string) {
    return apiClient.get<Connector[]>(
      `/connectors/creator/${creatorId}`
    );
  },

  /**
   * Create connector
   */
  async createConnector(data: CreateConnectorInput) {
    return apiClient.post<Connector>('/connectors', {
      ...data,
      downloads: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Update connector
   */
  async updateConnector(
    id: string,
    data: UpdateConnectorInput
  ) {
    return apiClient.patch<Connector>(
      `/connectors/${id}`,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  /**
   * Delete connector
   */
  async deleteConnector(id: string) {
    return apiClient.delete<void>(
      `/connectors/${id}`
    );
  },

  /**
   * Increment download count
   */
  async incrementDownloads(id: string) {
    return apiClient.post<Connector>(
      `/connectors/${id}/downloads`,
      {}
    );
  },

  /**
   * Connector statistics
   */
  async getConnectorStats() {
    return apiClient.get<ConnectorStats>(
      '/connectors/stats'
    );
  },

  /**
   * Popular connectors
   */
  async getPopularConnectors(limit = 10) {
    return apiClient.getWithQuery<Connector[]>(
      '/connectors/popular',
      { limit }
    );
  },

  /**
   * Recent connectors
   */
  async getRecentConnectors(limit = 10) {
    return apiClient.getWithQuery<Connector[]>(
      '/connectors/recent',
      { limit }
    );
  },

  /**
   * File connectors
   */
  async fetchFileConnectors() {
    return apiClient.get<ConnectorFile[]>(
      '/connectors/files'
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
