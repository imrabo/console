import { PaymentStatus, RegistrationStatus } from './webiner.enum.types';

/**
 * Shared registration properties used by Create/Update APIs.
 */
export interface WebinarRegistrationBase {
  webinarId: string;
  userId: string;

  // Payment Information
  paymentStatus: PaymentStatus;
  paymentId?: string;

  // Registration Status
  registrationStatus?: RegistrationStatus;
}

/**
 * Stored Webinar Registration Entity
 */
export interface WebinarRegistration extends WebinarRegistrationBase {
  id: string;

  // Attendance Tracking
  joinedAt?: Date | string;
  leftAt?: Date | string;
  attendanceDuration?: number;

  // User Engagement
  certificateIssued: boolean;
  feedbackSubmitted: boolean;
  reminderSent: boolean;

  // Timestamps
  registeredAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Payload for creating a registration.
 */
export interface CreateWebinarRegistrationDTO extends WebinarRegistrationBase {}

/**
 * Payload for updating a registration.
 */
export interface UpdateWebinarRegistrationDTO extends Partial<WebinarRegistrationBase> {
  joinedAt?: Date | string;
  leftAt?: Date | string;
  attendanceDuration?: number;

  certificateIssued?: boolean;
  feedbackSubmitted?: boolean;
  reminderSent?: boolean;
}

/**
 * Firestore document.
 * Currently identical to WebinarRegistration.
 */
export type WebinarRegistrationDocument = WebinarRegistration;
