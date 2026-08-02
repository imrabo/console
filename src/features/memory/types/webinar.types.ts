import { WebinarCategory, WebinarStatus } from './webiner.enum.types';

// Main Webinar Type
export interface Webinar {
  id: string;
  // Basic Information
  title: string;
  description: string;
  thumbnailUrl?: string;

  // Speaker Information
  speakerName: string;
  speakerImageUrl?: string;
  speakerDesignation?: string;

  // Categorization & Status
  category: WebinarCategory;
  isPaid: boolean;
  amount?: number;
  isFeatured: boolean;
  isActive: boolean;
  status: WebinarStatus;

  // Scheduling
  scheduledAt: Date | string;
  endAt?: Date | string;

  // Access & Participation
  meetingUrl?: string;
  maxParticipants?: number;
  registeredCount: number;

  // Media
  recordingUrl?: string;

  // Metadata
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Shared webinar properties used by Create/Update APIs.
 */
export interface WebinarBase {
  // Basic Information
  title: string;
  description: string;
  thumbnailUrl?: string;

  // Speaker Information
  speakerName: string;
  speakerImageUrl?: string;
  speakerDesignation?: string;

  // Categorization
  category: WebinarCategory;

  // Pricing
  isPaid: boolean;
  amount?: number;

  // Visibility
  isFeatured: boolean;
  isActive: boolean;

  // Scheduling
  scheduledAt: Date | string;
  endAt?: Date | string;

  // Meeting
  meetingUrl?: string;
  maxParticipants?: number;

  // Status
  status?: WebinarStatus;
}

/**
 * Stored Webinar Entity
 */
export interface Webinar extends WebinarBase {
  id: string;

  registeredCount: number;

  recordingUrl?: string;

  createdAt: Date | string;
  updatedAt: Date | string;

  createdBy: string;
  updatedBy?: string;
}

/**
 * Payload for creating a webinar.
 */
export interface CreateWebinarDTO extends WebinarBase { }

/**
 * Payload for updating a webinar.
 */
export interface UpdateWebinarDTO extends Partial<WebinarBase> {
  updatedAt?: Date | string;
}

/**
 * Firestore document.
 * Currently identical to Webinar.
 */
export type WebinarDocument = Webinar;
