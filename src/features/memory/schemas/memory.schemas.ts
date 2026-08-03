import * as zod from 'zod';

import { MemoryCategory, MemoryStatus, PaymentStatus, RegistrationStatus } from '../types'; // adjust path

// Enums
export const categoryEnum = zod.nativeEnum(MemoryCategory);

export const memoryStatusEnum = zod.nativeEnum(MemoryStatus);

export const paymentStatusEnum = zod.nativeEnum(PaymentStatus);

export const registrationStatusEnum = zod.nativeEnum(RegistrationStatus);

// Base Memory Schema
export const memoryBaseSchema = zod.object({
  title: zod
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters'),

  description: zod
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description cannot exceed 5000 characters'),

  thumbnailUrl: zod.string().url('Invalid URL format').optional().or(zod.literal('')),

  speakerName: zod
    .string()
    .min(1, 'Speaker name is required')
    .max(100, 'Speaker name cannot exceed 100 characters'),

  speakerImageUrl: zod.string().url('Invalid URL format').optional().or(zod.literal('')),

  speakerDesignation: zod
    .string()
    .max(200, 'Speaker designation cannot exceed 200 characters')
    .optional()
    .or(zod.literal('')),

  category: categoryEnum,

  isPaid: zod.boolean(),

  amount: zod.number().min(0, 'Amount must be positive').optional(),

  isFeatured: zod.boolean().default(false),

  isActive: zod.boolean().default(true),

  scheduledAt: zod.union([zod.string().datetime('Invalid date format'), zod.date()]),

  endAt: zod.union([zod.string().datetime('Invalid date format'), zod.date()]).optional(),

  meetingUrl: zod.string().url('Invalid meeting URL format').optional().or(zod.literal('')),

  maxParticipants: zod.number().min(1, 'Maximum participants must be at least 1').optional(),

  status: memoryStatusEnum,

  recordingUrl: zod.string().url('Invalid URL format').optional().or(zod.literal('')),
});



export const createMemorySchema = zod
  .object({
    title: zod
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(150, 'Title cannot exceed 150 characters'),

    description: zod
      .string()
      .min(1, 'Description is required')
      .max(5000, 'Description cannot exceed 5000 characters'),

    speakerName: zod
      .string()
      .min(1, 'Speaker name is required')
      .max(100, 'Speaker name cannot exceed 100 characters'),

    speakerDesignation: zod
      .string()
      .max(200, 'Speaker designation cannot exceed 200 characters')
      .optional()
      .or(zod.literal('')),

    scheduledAt: zod.string().min(1, 'Schedule date is required'),

    endAt: zod.coerce
      .number()
      .min(1, 'Duration must be at least 1 minute'),

    meetingUrl: zod
      .string()
      .url('Invalid meeting URL')
      .optional()
      .or(zod.literal('')),

    thumbnailUrl: zod
      .string()
      .url('Invalid thumbnail URL')
      .optional()
      .or(zod.literal('')),

    status: memoryStatusEnum,
  })
  .superRefine((data, ctx) => {
    const scheduledDate = new Date(data.scheduledAt);

    if (isNaN(scheduledDate.getTime())) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['scheduledAt'],
        message: 'Invalid schedule date',
      });
      return;
    }

    if (scheduledDate <= new Date()) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['scheduledAt'],
        message: 'Scheduled date must be in the future',
      });
    }
  });



// Update Memory Schema
export const updateMemorySchema = memoryBaseSchema.partial().superRefine((data, ctx) => {
  // Only validate amount requirement if isPaid is being updated
  if (data.isPaid !== undefined && data.isPaid && data.amount === undefined) {
    ctx.addIssue({
      code: zod.ZodIssueCode.custom,
      message: 'Amount is required when memory is paid',
      path: ['amount'],
    });
  }

  // Validate endAt if both scheduledAt and endAt are provided
  if (data.scheduledAt && data.endAt) {
    const scheduledDate = new Date(data.scheduledAt);
    const endDate = new Date(data.endAt);
    if (endDate <= scheduledDate) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'End time must be after scheduled time',
        path: ['endAt'],
      });
    }
  }
});

// Memory Registration Base Schema
export const memoryRegistrationBaseSchema = zod.object({
  memoryId: zod.string().min(1, 'Memory ID is required'),
  userId: zod.string().min(1, 'User ID is required'),
  paymentStatus: paymentStatusEnum,
  paymentId: zod.string().optional(),
  registrationStatus: registrationStatusEnum,
  joinedAt: zod.union([zod.string().datetime(), zod.date()]).optional(),
  leftAt: zod.union([zod.string().datetime(), zod.date()]).optional(),
  attendanceDuration: zod.number().min(0, 'Attendance duration cannot be negative').optional(),
  certificateIssued: zod.boolean().default(false),
  feedbackSubmitted: zod.boolean().default(false),
  reminderSent: zod.boolean().default(false),
  registeredAt: zod.union([zod.string().datetime(), zod.date()]).optional(),
});

// Create Registration Schema
export const createRegistrationSchema = memoryRegistrationBaseSchema.superRefine((data, ctx) => {
  // Validate that leftAt is after joinedAt if both are provided
  if (data.joinedAt && data.leftAt) {
    const joinedDate = new Date(data.joinedAt);
    const leftDate = new Date(data.leftAt);
    if (leftDate <= joinedDate) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Left time must be after joined time',
        path: ['leftAt'],
      });
    }
  }

  // Validate paymentStatus for free memorys
  // Note: This would need memory context, but we'll handle it in the service
});

// Update Registration Schema
export const updateRegistrationSchema = memoryRegistrationBaseSchema
  .partial()
  .superRefine((data, ctx) => {
    // Validate that leftAt is after joinedAt if both are provided
    if (data.joinedAt && data.leftAt) {
      const joinedDate = new Date(data.joinedAt);
      const leftDate = new Date(data.leftAt);
      if (leftDate <= joinedDate) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Left time must be after joined time',
          path: ['leftAt'],
        });
      }
    }
  });

// Query parameter schemas
export const memoryQuerySchema = zod.object({
  status: memoryStatusEnum.optional(),
  category: categoryEnum.optional(),
  isFeatured: zod.boolean().optional(),
  isActive: zod.boolean().optional(),
  isPaid: zod.boolean().optional(),
  limit: zod.number().min(1).max(100).default(10),
  page: zod.number().min(1).default(1),
  search: zod.string().optional(),
});

export const registrationQuerySchema = zod.object({
  memoryId: zod.string().optional(),
  userId: zod.string().optional(),
  registrationStatus: registrationStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
  certificateIssued: zod.boolean().optional(),
  limit: zod.number().min(1).max(100).default(10),
  page: zod.number().min(1).default(1),
});

// Type exports
export type CreateMemoryFormValues = zod.infer<typeof createMemorySchema>;
export type UpdateMemoryFormValues = zod.infer<typeof updateMemorySchema>;
export type CreateRegistrationFormValues = zod.infer<typeof createRegistrationSchema>;
export type UpdateRegistrationFormValues = zod.infer<typeof updateRegistrationSchema>;
export type MemoryQueryParams = zod.infer<typeof memoryQuerySchema>;
export type RegistrationQueryParams = zod.infer<typeof registrationQuerySchema>;
