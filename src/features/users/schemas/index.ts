import * as z from 'zod';

import { MembershipType, UserStatus, Gender, ThemeMode } from '../types/users.enums';

export const childSchema = z.object({
  name: z.string().min(1, 'Child name is required'),

  dob: z.date(),

  gender: z.nativeEnum(Gender),
});

export const userPreferencesSchema = z.object({
  themeMode: z.nativeEnum(ThemeMode),

  languageCode: z.string().default('en'),

  notificationsEnabled: z.boolean(),

  emailNotificationsEnabled: z.boolean(),

  smsNotificationsEnabled: z.boolean(),

  biometricEnabled: z.boolean(),
});

/* ================================================================
   USER FORM SCHEMA
================================================================ */

export const userFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters')
    .refine((value) => /^[A-Za-z' ]+$/.test(value), {
      message: 'Full name can only contain letters, spaces, and apostrophes',
    }),

  email: z.string().email('Please enter a valid email'),

  countryCode: z
    .string()
    .min(1, 'Country code is required')
    .regex(/^[0-9]+$/, 'Invalid country code'),

  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(10, 'Phone number cannot exceed 10 digits')
    .regex(/^[0-9]+$/, 'Phone number can only contain digits'),

  membershipType: z.nativeEnum(MembershipType),

  status: z.nativeEnum(UserStatus),

  isActive: z.boolean().default(true).optional(),

  isExpert: z.boolean().default(false).optional(),

  gender: z.nativeEnum(Gender),

  profileImageUrl: z
    .union([
      z.string().url('Invalid image URL').startsWith('https://', 'Image URL must use HTTPS'),

      z.literal(''),
    ])
    .optional()
    .transform((value) => value || undefined),
});

/* ================================================================
   CREATE
================================================================ */

export const createUserSchema = userFormSchema.extend({
  membershipType: z.nativeEnum(MembershipType).default(MembershipType.FREE),

  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),

  isActive: z.boolean().default(true).optional(),

  isExpert: z.boolean().default(false).optional(),
});

/* ================================================================
   EDIT
================================================================ */

export const editUserSchema = userFormSchema.partial();

/* ================================================================
   TYPES
================================================================ */

/**
 * Input values used by React Hook Form.
 */
export type UserFormInput = z.input<typeof userFormSchema>;

/**
 * Validated/transformed values returned
 * by the Zod resolver.
 */
export type UserFormValues = z.output<typeof userFormSchema>;

export type CreateUserFormInput = z.input<typeof createUserSchema>;

export type CreateUserFormValues = z.output<typeof createUserSchema>;

export type EditUserFormInput = z.input<typeof editUserSchema>;

export type EditUserFormValues = z.output<typeof editUserSchema>;
