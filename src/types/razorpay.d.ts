export {};

declare global {
  interface RazorpayPaymentFailedResponse {
    error?: {
      code?: string;
      description?: string;
      reason?: string;
      source?: string;
      step?: string;
      metadata?: Record<string, string>;
    };
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id: string;

    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };

    notes?: Record<string, string>;

    theme?: {
      color?: string;
    };

    retry?: {
      enabled?: boolean;
      max_count?: number;
    };

    handler?: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => void;

    modal?: {
      ondismiss?: () => void;
      confirm_close?: boolean;
      escape?: boolean;
      backdropclose?: boolean;
      animation?: boolean;
    };
  }

  interface RazorpayInstance {
    open(): void;
    close(): void;
    on(event: 'payment.failed', callback: (response: RazorpayPaymentFailedResponse) => void): void;
    on(event: string, callback: (response: unknown) => void): void;
  }

  interface RazorpayConstructor {
    new (options: RazorpayOptions): RazorpayInstance;
  }

  interface Window {
    Razorpay: RazorpayConstructor;
  }
}
