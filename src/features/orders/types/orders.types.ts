/**
 * Order type definitions based on OrderModel
 */

import { OrderStatus } from './orders.enums';

export interface Order {
  id: string;
  userId: string;
  resourceId: string;
  creatorId: string;
  title: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentId?: string;
  paymentMethod?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy?: string;
  updatedBy?: string;
  completedAt?: Date | string;
  refundedAt?: Date | string;
}

export interface OrderFilters extends Record<
  string,
  string | number | boolean | Date | null | undefined
> {
  search?: string;
  userId?: string;
  resourceId?: string;
  creatorId?: string;
  status?: OrderStatus;
  paymentMethod?: string;
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
  createdAfter?: Date | string;
  createdBefore?: Date | string;
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'amount'
    | 'title'
    | 'userId'
    | 'resourceId'
    | 'status'
    | 'paymentMethod';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderStats {
  totalOrders: number;
  totalAmount: number;
  pendingOrders: number;
  completedOrders: number;
  refundedOrders: number;
  failedOrders: number;
}

/**
 * Create order input.
 *
 * Server-generated fields such as id, timestamps, and payment-related
 * completion/refund fields are excluded.
 */
export type CreateOrderInput = Omit<
  Order,
  'id' | 'createdAt' | 'updatedAt' | 'completedAt' | 'refundedAt'
>;

/**
 * Update order input.
 *
 * Identity and immutable fields are excluded from updates.
 */
export type UpdateOrderInput = Partial<
  Omit<Order, 'id' | 'userId' | 'resourceId' | 'creatorId' | 'createdAt'>
>;
