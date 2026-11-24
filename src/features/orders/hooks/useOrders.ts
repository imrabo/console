import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import ordersService from '../services/ordersService';

import type { Order, OrderFilters } from '../types/orders.types';

import type {
  CreateOrderFormValues,
  UpdateOrderFormValues,
  UpdateOrderStatusFormValues,
  CompleteOrderFormValues,
} from '../schemas';

import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

/**
 * --------------------------------------------------------------------------
 * Query Keys
 * --------------------------------------------------------------------------
 */

const ORDER_KEYS = {
  all: [COLLECTIONS.ORDERS] as const,

  lists: () => [COLLECTIONS.ORDERS, 'list'] as const,

  list: (filters?: OrderFilters) => [COLLECTIONS.ORDERS, 'list', filters] as const,

  detail: (id: string) => [COLLECTIONS.ORDERS, id] as const,

  byUser: (userId: string) => [COLLECTIONS.ORDERS, 'by-user', userId] as const,

  byResource: (resourceId: string) => [COLLECTIONS.ORDERS, 'by-resource', resourceId] as const,

  byCreator: (creatorId: string) => [COLLECTIONS.ORDERS, 'by-creator', creatorId] as const,

  stats: () => [COLLECTIONS.ORDERS, 'stats'] as const,

  recent: (limit: number) => [COLLECTIONS.ORDERS, 'recent', limit] as const,

  highestValue: (limit: number) => [COLLECTIONS.ORDERS, 'highest-value', limit] as const,

  pending: () => [COLLECTIONS.ORDERS, 'pending'] as const,

  completed: () => [COLLECTIONS.ORDERS, 'completed'] as const,

  refunded: () => [COLLECTIONS.ORDERS, 'refunded'] as const,

  failed: () => [COLLECTIONS.ORDERS, 'failed'] as const,
};

/**
 * --------------------------------------------------------------------------
 * Queries
 * --------------------------------------------------------------------------
 */

/**
 * Fetch all orders with optional filters
 */
export const useOrdersQuery = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: ORDER_KEYS.list(filters),
    queryFn: () => ordersService.fetchOrders(filters),
  });
};

/**
 * Fetch a single order by ID
 */
export const useOrderQuery = (id: string) => {
  return useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: () => ordersService.fetchOrderById(id),
    enabled: !!id,
  });
};

/**
 * Fetch orders by user
 */
export const useOrdersByUserQuery = (userId: string) => {
  return useQuery({
    queryKey: ORDER_KEYS.byUser(userId),
    queryFn: () => ordersService.fetchOrdersByUser(userId),
    enabled: !!userId,
  });
};

/**
 * Fetch orders by resource
 */
export const useOrdersByResourceQuery = (resourceId: string) => {
  return useQuery({
    queryKey: ORDER_KEYS.byResource(resourceId),
    queryFn: () => ordersService.fetchOrdersByResource(resourceId),
    enabled: !!resourceId,
  });
};

/**
 * Fetch orders by creator
 */
export const useOrdersByCreatorQuery = (creatorId: string) => {
  return useQuery({
    queryKey: ORDER_KEYS.byCreator(creatorId),
    queryFn: () => ordersService.fetchOrdersByCreator(creatorId),
    enabled: !!creatorId,
  });
};

/**
 * Fetch order statistics
 */
export const useOrderStatsQuery = () => {
  return useQuery({
    queryKey: ORDER_KEYS.stats(),
    queryFn: () => ordersService.getOrderStats(),
  });
};

/**
 * Fetch recent orders
 */
export const useRecentOrdersQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: ORDER_KEYS.recent(limit),
    queryFn: () => ordersService.getRecentOrders(limit),
  });
};

/**
 * Fetch highest-value orders
 */
export const useHighestValueOrdersQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: ORDER_KEYS.highestValue(limit),
    queryFn: () => ordersService.getHighestValueOrders(limit),
  });
};

/**
 * Fetch pending orders
 */
export const usePendingOrdersQuery = () => {
  return useQuery({
    queryKey: ORDER_KEYS.pending(),
    queryFn: () => ordersService.getPendingOrders(),
  });
};

/**
 * Fetch completed orders
 */
export const useCompletedOrdersQuery = () => {
  return useQuery({
    queryKey: ORDER_KEYS.completed(),
    queryFn: () => ordersService.getCompletedOrders(),
  });
};

/**
 * Fetch refunded orders
 */
export const useRefundedOrdersQuery = () => {
  return useQuery({
    queryKey: ORDER_KEYS.refunded(),
    queryFn: () => ordersService.getRefundedOrders(),
  });
};

/**
 * Fetch failed orders
 */
// export const useFailedOrdersQuery = () => {
//   return useQuery({
//     queryKey: ORDER_KEYS.failed(),
//     queryFn: () => ordersService.getFailedOrders(),
//   });
// };

/**
 * --------------------------------------------------------------------------
 * Mutations
 * --------------------------------------------------------------------------
 */

/**
 * Create a new order
 */
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderFormValues) => ordersService.createOrder(data),

    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.stats(),
      });

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.ORDERS, 'recent'],
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byUser(newOrder.userId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byResource(newOrder.resourceId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byCreator(newOrder.creatorId),
      });

      toast.success(`Order "${newOrder.title}" created successfully`);
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create order');
    },
  });
};

/**
 * Update an existing order
 */
export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderFormValues }) =>
      ordersService.updateOrder(id, data),

    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(updatedOrder.id),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.stats(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.recent(10),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byUser(updatedOrder.userId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byResource(updatedOrder.resourceId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byCreator(updatedOrder.creatorId),
      });

      toast.success(`Order "${updatedOrder.title}" updated successfully`);
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update order');
    },
  });
};

/**
 * Delete an order
 */
export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.deleteOrder(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });

      queryClient.removeQueries({
        queryKey: ORDER_KEYS.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.stats(),
      });

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.ORDERS, 'recent'],
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.pending(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.completed(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.refunded(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.failed(),
      });

      toast.success('Order deleted successfully');
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to delete order');
    },
  });
};

/**
 * Update order status
 */
export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusFormValues }) =>
      ordersService.updateOrderStatus(id, data.status),

    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(updatedOrder.id),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.stats(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byUser(updatedOrder.userId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byResource(updatedOrder.resourceId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byCreator(updatedOrder.creatorId),
      });

      toast.success(`Order status updated to "${updatedOrder.status}"`);
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update order status');
    },
  });
};

/**
 * Complete an order
 */
export const useCompleteOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: CompleteOrderFormValues }) =>
      ordersService.completeOrder(id, data),

    onSuccess: (completedOrder) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(completedOrder.id),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.stats(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.pending(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.completed(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.recent(10),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byUser(completedOrder.userId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byResource(completedOrder.resourceId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byCreator(completedOrder.creatorId),
      });

      toast.success(`Order "${completedOrder.title}" completed successfully`);
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to complete order');
    },
  });
};

/**
 * Refund an order
 */
export const useRefundOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.refundOrder(id),

    onSuccess: (refundedOrder) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(refundedOrder.id),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.stats(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.completed(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.refunded(),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.recent(10),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byUser(refundedOrder.userId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byResource(refundedOrder.resourceId),
      });

      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.byCreator(refundedOrder.creatorId),
      });

      toast.success(`Order "${refundedOrder.title}" refunded successfully`);
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to refund order');
    },
  });
};
