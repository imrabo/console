import type { Payment, PaymentFilters } from '../types/payment.types';
import type { PaginatedResponse } from '@/types/PaginatedResponse';

import type {
  CreateResourceCheckoutInput,
  CreateResourceCheckoutResponse,
  VerifyResourcePaymentInput,
  VerifyResourcePaymentResponse,
  CreateWebinarPaymentOrderInput,
  CreateWebinarPaymentOrderResponse,
  VerifyWebinarPaymentInput,
  VerifyWebinarPaymentResponse,
} from '../types/razorpay.types';

class PaymentService {
  private readonly baseUrl = '/api/payments';

  /** Fetch every page for helpers whose contract is a complete matching list. */
  private async fetchAllPayments(filters: PaymentFilters = {}): Promise<Payment[]> {
    const limit = 100;
    const firstPage = await this.request<PaginatedResponse<Payment>>(
      `${this.baseUrl}${this.buildQuery({ ...filters, page: 1, limit })}`
    );
    const pages = await Promise.all(
      Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, index) =>
        this.request<PaginatedResponse<Payment>>(
          `${this.baseUrl}${this.buildQuery({ ...filters, page: index + 2, limit })}`
        )
      )
    );

    return [firstPage, ...pages].flatMap((page) => page.data);
  }

  /**
   * Execute an API request and normalize API errors.
   */
  private async request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...init,
      credentials: 'include',
      headers: {
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const message = await this.parseError(response);
      throw new Error(message ?? `Request failed (${response.status})`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  /**
   * Build query strings without dropping valid falsy values such as 0.
   */
  private buildQuery(values: Record<string, unknown>): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      if (value instanceof Date) {
        params.set(key, value.toISOString());
      } else if (typeof value === 'object') {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, String(value));
      }
    }

    const query = params.toString();
    return query ? `?${query}` : '';
  }

  /**
   * Parse JSON, plain-text and validation errors safely.
   */
  private async parseError(response: Response): Promise<string | null> {
    try {
      const text = await response.text();

      if (!text.trim()) {
        return null;
      }

      let payload: unknown;

      try {
        payload = JSON.parse(text);
      } catch {
        return text;
      }

      if (typeof payload === 'string') {
        return payload;
      }

      if (typeof payload !== 'object' || payload === null) {
        return null;
      }

      const body = payload as Record<string, unknown>;

      for (const key of ['message', 'error', 'detail']) {
        const value = body[key];

        if (typeof value === 'string' && value.trim()) {
          return value;
        }

        if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
          return value.join(', ');
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Fetch payments with pagination and filters.
   *
   * Returns the requested page and metadata for the complete filtered set.
   */
  async fetchPayments(filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
    return this.request<PaginatedResponse<Payment>>(
      `${this.baseUrl}${this.buildQuery({
        ...(filters as Record<string, unknown> | undefined),
      })}`
    );
  }

  async fetchPaymentById(id: string): Promise<Payment> {
    return this.request<Payment>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }

  async fetchPaymentsByUser(userId: string): Promise<Payment[]> {
    return this.fetchAllPayments({ userId });
  }

  async fetchPaymentsByRazorpayOrderId(orderId: string): Promise<Payment[]> {
    return this.fetchAllPayments({ orderId });
  }

  async fetchPaymentsByRazorpayPaymentId(paymentId: string): Promise<Payment[]> {
    return this.fetchAllPayments({ paymentId });
  }

  async fetchPaymentsByPurchase(
    purchaseType: Payment['purchaseType'],
    purchaseId: string
  ): Promise<Payment[]> {
    return this.fetchAllPayments({ purchaseType, referenceId: purchaseId });
  }

  async getPaymentStats(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(`${this.baseUrl}/stats`);
  }

  async getRecentPayments(limit = 10): Promise<Payment[]> {
    const result = await this.request<PaginatedResponse<Payment>>(
      `${this.baseUrl}${this.buildQuery({
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit,
      })}`
    );
    return result.data;
  }

  async getHighestValuePayments(limit = 10): Promise<Payment[]> {
    const result = await this.request<PaginatedResponse<Payment>>(
      `${this.baseUrl}${this.buildQuery({
        sortBy: 'amount',
        sortOrder: 'desc',
        limit,
      })}`
    );
    return result.data;
  }

  async getPendingPayments(): Promise<Payment[]> {
    return this.fetchAllPayments({ status: 'created' });
  }

  async getCapturedPayments(): Promise<Payment[]> {
    return this.fetchAllPayments({ status: 'captured' });
  }

  async getFailedPayments(): Promise<Payment[]> {
    return this.fetchAllPayments({ status: 'failed' });
  }

  async getRefundedPayments(): Promise<Payment[]> {
    return this.fetchAllPayments({ status: 'refunded' });
  }

  /**
   * Create a resource checkout order.
   *
   * Confirm this path against your actual Next.js route.
   */
  async createResourceCheckout(
    data: CreateResourceCheckoutInput
  ): Promise<CreateResourceCheckoutResponse> {
    return this.request<CreateResourceCheckoutResponse>(`${this.baseUrl}/resource/create-order`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Verify a resource payment.
   *
   * Confirm this path against your actual Next.js route.
   */
  async verifyResourcePayment(
    data: VerifyResourcePaymentInput
  ): Promise<VerifyResourcePaymentResponse> {
    return this.request<VerifyResourcePaymentResponse>(`${this.baseUrl}/resource/verify`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Create a webinar payment order.
   *
   * Confirm this path against your actual Next.js route.
   */
  async createWebinarPaymentOrder(
    data: CreateWebinarPaymentOrderInput
  ): Promise<CreateWebinarPaymentOrderResponse> {
    return this.request<CreateWebinarPaymentOrderResponse>(`${this.baseUrl}/webinar/create-order`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Verify a webinar payment.
   */
  async verifyWebinarPayment(
    data: VerifyWebinarPaymentInput
  ): Promise<VerifyWebinarPaymentResponse> {
    return this.request<VerifyWebinarPaymentResponse>(`${this.baseUrl}/verify`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

const paymentService = new PaymentService();

export default paymentService;
