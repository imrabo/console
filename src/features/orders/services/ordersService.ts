import { apiClient } from '@/lib/api/client';
import type { PaginatedResponse } from '@/types/PaginatedResponse';

import {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStats,
  OrderFilters,
} from '../types/orders.types';

export const ordersService = {
  /**
   * Fetch all orders
   */
  async fetchOrders(filters?: OrderFilters) {
    return apiClient.get<PaginatedResponse<Order>>('/orders', filters);
  },

  /**
   * Fetch order by id
   */
  async fetchOrderById(id: string) {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  /**
   * Fetch orders by user
   */
  async fetchOrdersByUser(userId: string) {
    return apiClient.get<Order[]>(`/orders/user/${userId}`);
  },

  /**
   * Fetch orders by resource
   */
  async fetchOrdersByResource(resourceId: string) {
    return apiClient.get<Order[]>(`/orders/resource/${resourceId}`);
  },

  /**
   * Fetch orders by creator
   */
  async fetchOrdersByCreator(creatorId: string) {
    return apiClient.get<Order[]>(`/orders/creator/${creatorId}`);
  },

  /**
   * Create order
   */
  async createOrder(data: CreateOrderInput) {
    return apiClient.post<Order>('/orders', {
      ...data,
    });
  },

  /**
   * Update order
   */
  async updateOrder(id: string, data: UpdateOrderInput) {
    return apiClient.patch<Order>(`/orders/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Delete order
   */
  async deleteOrder(id: string) {
    return apiClient.delete<void>(`/orders/${id}`);
  },

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: Order['status']) {
    return apiClient.patch<Order>(`/orders/${id}`, { status });
  },

  /**
   * Mark order as completed
   */
  async completeOrder(
    id: string,
    data?: {
      paymentId?: string;
      paymentMethod?: string;
    }
  ) {
    return apiClient.patch<Order>(`/orders/${id}/complete`, {
      ...data,
      status: 'completed',
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });
  },

  /**
   * Refund order
   */
  async refundOrder(id: string) {
    return apiClient.patch<Order>(`/orders/${id}/refund`, {
      status: 'refunded',
      updatedAt: new Date().toISOString(),
      refundedAt: new Date().toISOString(),
    });
  },

  /**
   * Order statistics
   */
  async getOrderStats() {
    return apiClient.get<OrderStats>('/orders/stats');
  },

  /**
   * Recent orders
   */
  async getRecentOrders(limit = 10) {
    return apiClient.get<Order[]>('/orders/recent', { limit });
  },

  /**
   * Popular / highest-value orders
   */
  async getHighestValueOrders(limit = 10) {
    return apiClient.get<Order[]>('/orders/highest-value', { limit });
  },

  /**
   * Pending orders
   */
  async getPendingOrders() {
    return apiClient.get<Order[]>('/orders/pending');
  },

  /**
   * Completed orders
   */
  async getCompletedOrders() {
    return apiClient.get<Order[]>('/orders/completed');
  },

  /**
   * Refunded orders
   */
  async getRefundedOrders() {
    return apiClient.get<Order[]>('/orders/refunded');
  },
};

export default ordersService;
