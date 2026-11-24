import * as z from 'zod';

// Admin user schema matching the API response.
export const adminUserSchema = z.object({
  id: z.string().describe('Admin user ID'),
  email: z.string().email('Valid Email').describe('Admin login email'),
  fullName: z.string().min(1, 'Full name must be at least 1 character').describe('Required field'),
  // Passwords are never returned by the API.
  password: z.string().min(8).optional(),
  createdAt: z.union([z.instanceof(Date), z.string()]).describe('Timestamp of creation'),
  isActive: z.boolean().default(true),
});

// Form validation schema for admin registration/login
export const adminUserFormSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .refine(
        (value) => value === '' || value.length >= 8,
        'Password must be at least 8 characters'
      ),
  })
  .describe('Admin registration/login form');

export const adminUserCreateSchema = adminUserFormSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const adminUserUpdateSchema = adminUserFormSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Type inference for admin user
export type AdminUser = z.infer<typeof adminUserSchema>;
export type AdminUserFormData = z.infer<typeof adminUserFormSchema>;
