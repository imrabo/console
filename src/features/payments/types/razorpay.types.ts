import type { PaymentStatus } from './payment.types';

/**
 * ============================================================
 * RESOURCE
 * ============================================================
 */

export interface CreateResourceCheckoutInput {
  resourceId: string;
  idempotencyKey?: string;
}

export interface CreateResourceCheckoutResponse {
  orderId: string;
  amount: number;
  currency: string;

  resourceId: string;

  keyId: string;

  name: string;
  description: string;
}

export interface VerifyResourcePaymentInput {
  resourceId: string;

  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifyResourcePaymentResponse {
  success: boolean;

  resourceId: string;

  paymentId: string;
  orderId: string;

  accessUrl?: string;

  message?: string;
}

/**
 * ============================================================
 * WEBINAR
 * ============================================================
 */

export interface CreateWebinarPaymentOrderInput {
  webinarId: string;
  idempotencyKey?: string;
}

export interface CreateWebinarPaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;

  webinarId: string;

  keyId: string;

  name: string;
  description: string;
}

export interface VerifyWebinarPaymentInput {
  webinarId: string;

  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifyWebinarPaymentResponse {
  success: boolean;

  webinarId: string;

  paymentId: string;
  orderId: string;

  registrationId: string;

  paymentStatus: PaymentStatus;

  registrationStatus: string;

  message?: string;
}
