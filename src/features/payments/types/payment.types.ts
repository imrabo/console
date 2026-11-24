export const PaymentStatus = {
  created: 'created',
  authorized: 'authorized',
  captured: 'captured',
  failed: 'failed',
  refunded: 'refunded',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export type PaymentPurchaseType =
  'webinarRegistration' | 'resourcePurchase' | 'programPurchase' | 'expertRequest';

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  purchaseType: PaymentPurchaseType;
  referenceId: string;
  orderId: string | null;
  paymentId: string | null;
  status: PaymentStatus;
  isPaid: boolean;
  verified: boolean;
  month: number;
  year: number;
  timestamp: number | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
}

export interface CreatePaymentInput {
  userId: string;
  amount: number;
  currency?: string;
  purchaseType: PaymentPurchaseType;
  referenceId: string;
  orderId?: string | null;
  paymentId?: string | null;
  status?: PaymentStatus;
  isPaid?: boolean;
  verified?: boolean;
  month: number;
  year: number;
  timestamp?: number | null;
}

export interface UpdatePaymentInput {
  orderId?: string | null;
  paymentId?: string | null;
  status?: PaymentStatus;
  isPaid?: boolean;
  verified?: boolean;
  month?: number;
  year?: number;
  timestamp?: number | null;
}

export interface PaymentFilters {
  search?: string;
  userId?: string;
  orderId?: string;
  paymentId?: string;
  purchaseType?: PaymentPurchaseType;
  referenceId?: string;
  status?: PaymentStatus;
  isPaid?: boolean;
  verified?: boolean;
  currency?: string;
  month?: number | string;
  year?: number | string;
  minAmount?: number | string;
  maxAmount?: number | string;
  createdAfter?: string;
  createdBefore?: string;
  sortBy?: keyof Payment;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  capturedAmount: number;
  capturedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
}
