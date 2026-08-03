import { MemoryCategory, MemoryStatus } from './memory.enum.types';

// Main Memory Type
export interface Memory {
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
  category: MemoryCategory;
  isPaid: boolean;
  amount?: number;
  isFeatured: boolean;
  isActive: boolean;
  status: MemoryStatus;

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
 * Shared memory properties used by Create/Update APIs.
 */
export interface MemoryBase {
  // Basic Information
  title: string;
  description: string;
  thumbnailUrl?: string;

  // Speaker Information
  speakerName: string;
  speakerImageUrl?: string;
  speakerDesignation?: string;

  // Categorization
  category: MemoryCategory;

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
  status?: MemoryStatus;
}

/**
 * Stored Memory Entity
 */
export interface Memory extends MemoryBase {
  id: string;

  registeredCount: number;

  recordingUrl?: string;

  createdAt: Date | string;
  updatedAt: Date | string;

  createdBy: string;
  updatedBy?: string;
}

/**
 * Payload for creating a memory.
 */
export interface CreateMemoryDTO extends MemoryBase { }

/**
 * Payload for updating a memory.
 */
export interface UpdateMemoryDTO extends Partial<MemoryBase> {
  updatedAt?: Date | string;
}

/**
 * Firestore document.
 * Currently identical to Memory.
 */
export type MemoryDocument = Memory;
