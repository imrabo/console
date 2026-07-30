import * as z from 'zod';

import {
  MembershipType,
  UserStatus,
  Gender,
  ThemeMode,
} from '../types/users.enums';

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

export const userFormSchema = z.object({



  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters'),

  email: z.string().email('Please enter a valid email'),

  mobileNo: z
    .string()
    .min(10, 'Please enter a valid mobile number'),

  membershipType: z.nativeEnum(MembershipType),



  status: z.nativeEnum(UserStatus),

  isActive: z.boolean().default(true).optional(),

  isExpert: z.boolean().default(false).optional(),

  // dateOfBirth: z.date().optional(),

  gender: z.nativeEnum(Gender),

  // children: z.array(childSchema).default([]).optional(),
});

export const createUserSchema = userFormSchema.extend({
  membershipType: z
    .nativeEnum(MembershipType)
    .default(MembershipType.FREE),

  status: z
    .nativeEnum(UserStatus)
    .default(UserStatus.ACTIVE),

  isActive: z.boolean().default(true).optional(),

  isExpert: z.boolean().default(false).optional(),

});

export const editUserSchema = userFormSchema.partial();

export type UserFormValues = z.infer<typeof userFormSchema>;

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export type EditUserFormValues = z.infer<typeof editUserSchema>;
