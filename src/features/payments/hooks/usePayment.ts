import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Payment, PaymentFilters } from '../types/payment.types';
import type {
  CreateResourceCheckoutInput,
  VerifyResourcePaymentInput,
  CreateWebinarPaymentOrderInput,
  VerifyWebinarPaymentInput,
} from '../types/razorpay.types';
import paymentService from '../services/paymentServices';

/**
 * Centralized React Query keys.
 */
export const PAYMENT_KEYS = {
  all: ['payments'] as const,

  lists: () => [...PAYMENT_KEYS.all, 'list'] as const,
  list: (filters?: PaymentFilters) => [...PAYMENT_KEYS.lists(), filters ?? {}] as const,

  details: () => [...PAYMENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PAYMENT_KEYS.details(), id] as const,

  byUser: (userId: string) => [...PAYMENT_KEYS.all, 'user', userId] as const,

  byRazorpayOrder: (orderId: string) => [...PAYMENT_KEYS.all, 'razorpay-order', orderId] as const,

  byRazorpayPayment: (paymentId: string) =>
    [...PAYMENT_KEYS.all, 'razorpay-payment', paymentId] as const,

  byPurchase: (purchaseType: Payment['purchaseType'], purchaseId: string) =>
    [...PAYMENT_KEYS.all, 'purchase', purchaseType, purchaseId] as const,

  stats: () => [...PAYMENT_KEYS.all, 'stats'] as const,
  recent: (limit: number) => [...PAYMENT_KEYS.all, 'recent', limit] as const,
  highestValue: (limit: number) => [...PAYMENT_KEYS.all, 'highest-value', limit] as const,

  pending: () => [...PAYMENT_KEYS.all, 'status', 'pending'] as const,
  captured: () => [...PAYMENT_KEYS.all, 'status', 'captured'] as const,
  failed: () => [...PAYMENT_KEYS.all, 'status', 'failed'] as const,
  refunded: () => [...PAYMENT_KEYS.all, 'status', 'refunded'] as const,
};

/**
 * Fetch all payments with optional filters.
 */
export const usePaymentsQuery = (filters?: PaymentFilters) =>
  useQuery({
    queryKey: PAYMENT_KEYS.list(filters),
    queryFn: () => paymentService.fetchPayments(filters),
  });

/**
 * Fetch a payment by ID.
 */
export const usePaymentQuery = (id: string) =>
  useQuery({
    queryKey: PAYMENT_KEYS.detail(id),
    queryFn: () => paymentService.fetchPaymentById(id),
    enabled: Boolean(id),
  });

/**
 * Fetch payments by user.
 */
export const usePaymentsByUserQuery = (userId: string) =>
  useQuery({
    queryKey: PAYMENT_KEYS.byUser(userId),
    queryFn: () => paymentService.fetchPaymentsByUser(userId),
    enabled: Boolean(userId),
  });

/**
 * Fetch payments by Razorpay order ID.
 */
export const usePaymentsByRazorpayOrderQuery = (orderId: string) =>
  useQuery({
    queryKey: PAYMENT_KEYS.byRazorpayOrder(orderId),
    queryFn: () => paymentService.fetchPaymentsByRazorpayOrderId(orderId),
    enabled: Boolean(orderId),
  });

/**
 * Fetch payments by Razorpay payment ID.
 */
export const usePaymentsByRazorpayPaymentQuery = (paymentId: string) =>
  useQuery({
    queryKey: PAYMENT_KEYS.byRazorpayPayment(paymentId),
    queryFn: () => paymentService.fetchPaymentsByRazorpayPaymentId(paymentId),
    enabled: Boolean(paymentId),
  });

/**
 * Fetch payments by purchase type and purchase ID.
 */
export const usePaymentsByPurchaseQuery = (
  purchaseType: Payment['purchaseType'],
  purchaseId: string
) =>
  useQuery({
    queryKey: PAYMENT_KEYS.byPurchase(purchaseType, purchaseId),
    queryFn: () => paymentService.fetchPaymentsByPurchase(purchaseType, purchaseId),
    enabled: Boolean(purchaseType && purchaseId),
  });

/**
 * Fetch payment statistics.
 */
export const usePaymentStatsQuery = () =>
  useQuery({
    queryKey: PAYMENT_KEYS.stats(),
    queryFn: () => paymentService.getPaymentStats(),
  });

/**
 * Fetch recent payments.
 */
export const useRecentPaymentsQuery = (limit = 10) =>
  useQuery({
    queryKey: PAYMENT_KEYS.recent(limit),
    queryFn: () => paymentService.getRecentPayments(limit),
  });

/**
 * Fetch highest-value payments.
 */
export const useHighestValuePaymentsQuery = (limit = 10) =>
  useQuery({
    queryKey: PAYMENT_KEYS.highestValue(limit),
    queryFn: () => paymentService.getHighestValuePayments(limit),
  });

/**
 * Fetch pending payments.
 */
export const usePendingPaymentsQuery = () =>
  useQuery({
    queryKey: PAYMENT_KEYS.pending(),
    queryFn: () => paymentService.getPendingPayments(),
  });

/**
 * Fetch captured payments.
 */
export const useCapturedPaymentsQuery = () =>
  useQuery({
    queryKey: PAYMENT_KEYS.captured(),
    queryFn: () => paymentService.getCapturedPayments(),
  });

/**
 * Fetch failed payments.
 */
export const useFailedPaymentsQuery = () =>
  useQuery({
    queryKey: PAYMENT_KEYS.failed(),
    queryFn: () => paymentService.getFailedPayments(),
  });

/**
 * Fetch refunded payments.
 */
export const useRefundedPaymentsQuery = () =>
  useQuery({
    queryKey: PAYMENT_KEYS.refunded(),
    queryFn: () => paymentService.getRefundedPayments(),
  });

/**
 * Create a resource checkout order.
 *
 * The endpoint must create the order on the server.
 */
export const useCreateResourceCheckoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResourceCheckoutInput) => paymentService.createResourceCheckout(data),

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create resource checkout');
    },

    onSuccess: () => {
      // Creating an order may add a payment record.
      void queryClient.invalidateQueries({
        queryKey: PAYMENT_KEYS.all,
      });
    },
  });
};

/**
 * Verify a resource payment.
 */
export const useVerifyResourcePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyResourcePaymentInput) => paymentService.verifyResourcePayment(data),

    onSuccess: () => {
      toast.success('Resource payment verified');

      void queryClient.invalidateQueries({
        queryKey: PAYMENT_KEYS.all,
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify resource payment');
    },
  });
};

/**
 * Create a webinar payment order.
 */
export const useCreateWebinarPaymentOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWebinarPaymentOrderInput) =>
      paymentService.createWebinarPaymentOrder(data),

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create webinar payment order');
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: PAYMENT_KEYS.all,
      });
    },
  });
};

/**
 * Verify a webinar payment.
 */
export const useVerifyWebinarPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyWebinarPaymentInput) => paymentService.verifyWebinarPayment(data),

    onSuccess: () => {
      toast.success('Webinar payment verified');

      void queryClient.invalidateQueries({
        queryKey: PAYMENT_KEYS.all,
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify webinar payment');
    },
  });
};
